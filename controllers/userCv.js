import UserCV from '../models/users_cv.js'; 
import UserRegister from '../models/users_register.js'; 
import AreaOcupacion from '../models/area_ocupacion.js';
import TipoAreaOcupacion from '../models/tipo_area_ocupacion.js';
import Aptitud from '../models/aptitudes.js'; 

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
    if (!params.tipo_documento || !params.numero_dto || !params.bio || !params.ocupacion || !params.certificaciones_experiencia ||!params.region_residencia || !params.tiempo_experiencia || !params.area_ocupacion || !params.tipo_area_ocupacion || !params.aptitudes || params.aptitudes.length === 0) {
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
      user_register_id: userId,
      segundo_nombre: params.segundo_nombre || null,
      segundo_apellido: params.segundo_apellido || null,
      celular: params.celular || null,
      tipo_documento: params.tipo_documento,
      numero_dto: params.numero_dto,
      bio: params.bio,
      ocupacion: params.ocupacion,
      region_residencia: params.region_residencia,
      tiempo_experiencia: params.tiempo_experiencia,
      certificaciones_experiencia: params.certificaciones_experiencia || null,
      area_ocupacion: area._id, // Usar el nombre correcto del campo
      tipo_area_ocupacion: tipoArea._id, // Usar el nombre correcto del campo
      aptitudes: aptitudesArray.map((apt) => apt._id),
    });

    // Guardar en la base de datos
    const savedCV = await newCV.save();
    res.status(201).json(savedCV);

  } catch (error) {
    console.error("Error al crear CV:", error);
    res.status(500).json({ message: 'Error al registrar la hoja de vida', error });
  }
};
