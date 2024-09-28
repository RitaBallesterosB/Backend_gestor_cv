import UserCV from '../models/users_cv.js'; 
import UserRegister from '../models/users_register.js'; 
import AreaOcupacion from '../models/area_ocupacion.js';
import TipoAreaOcupacion from '../models/tipo_area_ocupacion.js';
import Aptitud from '../models/aptitudes.js'; 
import path from 'path';


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

// Método para crear la hoja de vida
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



// Método para obtener la hoja de vida del usuario
export const getCVData = async (req, res) => {
  try {
    const userId = req.user.userId; // Extraer userId del token

    // Buscar la hoja de vida asociada al usuario
    const cvData = await UserCV.findOne({ 
      user_register_id: userId,
      estado: true // Filtrar solo las hojas de vida activas
     })
      .populate('area_ocupacion', 'nombre') // Populamos el área de ocupación por la referencia a otro campo con relación a otro documento
      .populate('tipo_area_ocupacion', 'nombre') // Populamos el tipo de área de ocupación
      .populate('aptitudes', 'nombre'); // Populamos las aptitudes

    // Si no se encuentra una hoja de vida ACTIVA, retornar error
    if (!cvData) {
      return res.status(404).json({
        status: "error",
        message: "Hoja de vida no encontrada ",
      });
    }

     // Devolver los datos de la hoja de vida junto con el estado
     return res.status(200).json({
      status: "success",
      cvData: {
        ...cvData.toObject(), // Convierte el documento a un objeto JavaScript
        estado: cvData.estado // Asegúrate de incluir el estado aquí
      }, 
    });
    
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener la hoja de vida:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la hoja de vida",
    });
  }
};

// Método para actualizar la hoja de vida del usuario
export const updateCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Obtener el ID del usuario del token
    const params = req.body; // Obtener los parámetros de la solicitud

    // Buscar la hoja de vida del usuario
    const cv = await UserCV.findOne({ 
      user_register_id: userId,
      estado: true // Filtrar solo las hojas de vida activas
     });
    if (!cv) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }

    // Variable para verificar si hay cambios
    let isChanged = false;

    // Actualizar los campos permitidos y verificar cambios
    if (params.celular) {
      cv.celular = params.celular;
      isChanged = true;
    }
    if (params.bio) {
      cv.bio = params.bio;
      isChanged = true;
    }
    if (params.ocupacion) {
      cv.ocupacion = params.ocupacion;
      isChanged = true;
    }
    if (params.region_residencia) {
      cv.region_residencia = params.region_residencia;
      isChanged = true;
    }
    if (params.tiempo_experiencia) {
      cv.tiempo_experiencia = params.tiempo_experiencia;
      isChanged = true;
    }
    // Asegurar de que solo se asignen los ObjectId
    if (params.area_ocupacion) {
      cv.area_ocupacion = params.area_ocupacion.areaOcupacionId; // Solo el ID
      isChanged = true;
    }
    if (params.tipo_area_ocupacion) {
      cv.tipo_area_ocupacion = params.tipo_area_ocupacion.tipoAreaOcupacionId; // Solo el ID
      isChanged = true;
    }
    if (params.aptitudes) {
      // Extraer solo los IDs de las aptitudes
      cv.aptitudes = params.aptitudes.map(aptitud => aptitud._id); // Cambia `_id` según el campo correcto en la solicitud
      isChanged = true;
    }
    // if (params.certificaciones_experiencia) {
    //   cv.certificaciones_experiencia = params.certificaciones_experiencia;
    //   isChanged = true;
    // }

    // Verificar si no hubo cambios
    if (!isChanged) {
      return res.status(400).json({ message: 'No se realizaron cambios en la hoja de vida' });
    }

    // Guardar los cambios
    const updatedCV = await cv.save();
    res.status(200).json({ message: 'Hoja de vida actualizada', cv: updatedCV });
  } catch (error) {
    console.error("Error al actualizar la hoja de vida:", error);
    res.status(500).json({ message: 'Error al actualizar la hoja de vida', error });
  }
};

// Método para (inactivar CV, ya que queda en la DB la hoja de vida)
export const deactivateCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Extraer userId del token

    // Buscar la hoja de vida del usuario
    const userCV = await UserCV.findOne({ user_register_id: userId });
    if (!userCV) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }
    //Borrar para el deploy
    console.log("Desactivando CV para el usuario:", userId)


    // Inactivar la hoja de vida
    userCV.estado = false;
    await userCV.save();

    console.log("Hoja de vida inactivada:", userCV.estado);

    res.status(200).json({ message: 'Hoja de vida inactivada exitosamente' });
  } catch (error) {
    console.error("Error al inactivar la hoja de vida:", error);
    res.status(500).json({ message: 'Error al inactivar la hoja de vida', error });
  }
};

// Método para reactivar la hoja de vida
export const reactivateCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Extraer userId del token

    // Buscar la hoja de vida del usuario
    const userCV = await UserCV.findOne({ user_register_id: userId });
    if (!userCV) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }

    // Verificar si ya está activa
    if (userCV.estado) {
      return res.status(400).json({ message: 'La hoja de vida ya está activa' });
    }

    // Reactivar la hoja de vida
    userCV.estado = true;
    await userCV.save();

    res.status(200).json({ message: 'Hoja de vida reactivada exitosamente' });
  } catch (error) {
    console.error("Error al reactivar la hoja de vida:", error);
    res.status(500).json({ message: 'Error al reactivar la hoja de vida', error });
  }
};

// Método para obtener las áreas de ocupación junto con sus tipos y aptitudes
export const getAreaOcupacionData = async (req, res) => {
  try {
    const areasOcupacion = await AreaOcupacion.find({ estado: true }).select('_id nombre');

    // Utilizamos `Promise.all` para esperar a que todas las promesas se resuelvan
    const areasOcupacionData = await Promise.all(
      areasOcupacion.map(async (area) => {
        // Buscar los tipos de áreas de ocupación relacionados con el área actual
        const tiposOcupacion = await TipoAreaOcupacion.find({
          areaOcupacion: area._id,
          estado: true
        }).select('_id nombre');

        // Para cada tipo de ocupación, obtenemos las aptitudes
        const tiposData = await Promise.all(
          tiposOcupacion.map(async (tipo) => {
            const aptitudes = await Aptitud.find({
              tipoAreaOcupacion: tipo._id,
              estado: true
            }).select('_id nombre');
            
            return {
              tipoAreaOcupacionId: tipo._id,
              nombre: tipo.nombre,
              aptitudes: aptitudes
            };
          })
        );

        // Retornamos el área de ocupación con los tipos y aptitudes correspondientes
        return {
          areaOcupacionId: area._id,
          nombre: area.nombre,
          tiposOcupacion: tiposData
        };
      })
    );

    // Devolver la respuesta con éxito
    return res.status(200).json({
      status: 'success',
      areasOcupacion: areasOcupacionData
    });
  } catch (error) {
    console.error("Error al obtener las áreas de ocupación:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener las áreas de ocupación'
    });
  }
};