import UserCV from '../models/users_cv.js'; 
import UserRegister from '../models/users_register.js'; 
import AreaOcupacion from '../models/area_ocupacion.js';
import TipoAreaOcupacion from '../models/tipo_area_ocupacion.js';
import Aptitud from '../models/aptitudes.js'; 


// Controlador para precargar los datos del usuario registrado
export const getUserDataForCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Extraer el ID del usuario del token o sesión

    // Buscar el usuario registrado en la base de datos por su ID
    const user = await UserRegister.findById(userId).select('nombre apellido correo_electronico'); // Seleccionar solo los campos necesarios

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver los datos del usuario al frontend para precargar el formulario
    res.status(200).json({
      status: 'success',
      user // Los datos del usuario se envían para ser precargados en el formulario
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
  }
};

export const createCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Extraer userId del token

    // Verificar si el usuario ya tiene una hoja de vida
    const existingCV = await UserCV.findOne({ user_register_id: userId });
    if (existingCV) {
      return res.status(400).json({ message: 'Ya tienes una hoja de vida registrada' });
    }

    // Obtener los datos del usuario registrado
    const user = await UserRegister.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar los parámetros recibidos
    let params= req.body;

    console.log('Datos recibidos:', req.body);


    // Validar los campos requeridos
    if (!params.tipo_documento || !params.numero_dto || !params.bio || !params.ocupacion || !params.region_residencia || !params.tiempo_experiencia || !params.area_ocupacion || !params.tipo_area_ocupacion || !params.aptitudes || params.aptitudes.length === 0) {
      return res.status(400).json({ message: 'Faltan parámetros necesarios' });
    }

    // Verificar que area_ocupacion es válida
    const area = await AreaOcupacion.findById(params.area_ocupacion);
    if (!area) {
      return res.status(404).json({ message: 'Área de ocupación no encontrada' });
    }

    // Verificar quetipo_area_ocupacion es válido
    const tipoArea = await TipoAreaOcupacion.findById(params.tipo_area_ocupacion);
    if (!tipoArea) {
      return res.status(404).json({ message: 'Tipo de área de ocupación no encontrado' });
    }

    console.log("Area:", area);
    console.log("Tipo de Área:", tipoArea);

    // Verificar que todas las aptitudes son válidas
    const aptitudesArray = await Aptitud.find({ _id: { $in: params.aptitudes } });
    if (aptitudesArray.length !== params.aptitudes.length) {
      return res.status(404).json({ message: 'Algunas aptitudes no fueron encontradas' });
    }

    // Crear una nueva hoja de vida
    const newCV = new UserCV({
      nombre_usuario: user.nombre,  // Agregar los datos del usuario
      segundo_nombre: params.segundo_nombre || null,
      apellido_usuario: user.apellido, // Agregar los datos del usuario
      segundo_apellido: params.segundo_apellido || null,
      correo_usuario: user.correo_electronico, // Agregar los datos del usuario
      user_register_id: userId,
      celular: params.celular || null,
      tipo_documento: params.tipo_documento,
      numero_dto: params.numero_dto,
      bio: params.bio,
      ocupacion: params.ocupacion,
      region_residencia: params.region_residencia,
      tiempo_experiencia: params.tiempo_experiencia,
      area_ocupacion: area._id, // Usar el nombre correcto del campo
      tipo_area_ocupacion: tipoArea._id, // Usar el nombre correcto del campo
      aptitudes: aptitudesArray.map((apt) => apt._id),
      certificaciones_experiencia: params.certificaciones_experiencia || []
      
    });

    // Guardar en la base de datos
    const savedCV = await newCV.save();
    res.status(201).json(savedCV);

  } catch (error) {
    console.error("Error al crear CV:", error);
    res.status(500).json({ message: 'Error al registrar la hoja de vida', error });
  }
};
