import UserRegister from "../models/users_register.js";
import bcrypt from "bcrypt"; // Para encriptar la contraseña
import { createToken } from "../services/jwt.js";
import UserCV from '../models/users_cv.js'; 

export const registerUser = async (req, res) => {
  try {
    let params = req.body;

    // Validación de los datos obtenidos
    if (!params.nombre || !params.apellido || !params.correo_electronico || !params.password) {
      return res.status(400).json({ status: "error", message: "Todos los campos son requeridos." });
    }

    // Crear el objeto de usuario
    let user_register = new UserRegister({
      nombre: params.nombre,
      apellido: params.apellido,
      correo_electronico: params.correo_electronico.toLowerCase(),
      password: params.password,
      role: params.role || 'usuario',
      imagen_perfil: null,
    });

    // Verificar si el usuario ya existe
    const existingUserRegister = await UserRegister.findOne({ correo_electronico: user_register.correo_electronico });
    if (existingUserRegister) {
      return res.status(409).json({ status: "error", message: "El correo electrónico ya está en uso." });
    }

    // Subir la imagen si se proporciona
    if (req.file) {
      user_register.imagen_perfil = req.file.path;
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    user_register.password = await bcrypt.hash(user_register.password, salt);

    // Guardar el usuario en la base de datos
    await user_register.save();

    // Generar token JWT después de guardar el usuario
    const token = createToken(user_register);

    // Devolver el usuario registrado junto con el token
    return res.status(201).json({
      status: "success",
      message: "Registro de usuario exitoso",
      token,
      user: {
        id: user_register._id,
        nombre: user_register.nombre,
        apellido: user_register.apellido,
        correo_electronico: user_register.correo_electronico,
        role: user_register.role,
        imagen_perfil: user_register.imagen_perfil,
      },
    });
  } catch (error) {
    console.log("Error en el registro de usuario:", error);
    return res.status(500).json({ status: "error", message: "Error en el registro de usuario" });
  }
};


// Método de autenticación de usuarios (login) usando JWT
export const login = async (req, res) => {
  try {
    // Obtener los parámetros del body
    let params = req.body;

    // Validar parámetros: correo_electronico, password
    if (!params.correo_electronico || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    // Buscar en la BD si existe el correo_electronico recibido
    const user = await UserRegister.findOne({ correo_electronico: params.correo_electronico.toLowerCase() });

    // Si no existe el usuario
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    // Comprobar la contraseña
    const validPassword = await bcrypt.compare(params.password, user.password);

    // Si la contraseña es incorrecta
    if (!validPassword) {
      return res.status(401).send({
        status: "error",
        message: "Contraseña incorrecta",
      });
    }

    // Verificar si el usuario tiene una hoja de vida registrada
    const userCV = await UserCV.findOne({ user_register_id: user._id });

    // Generar token JWT
    const token = createToken(user);

    // Devolver Token y datos del usuario autenticado
    return res.status(200).json({
      status: "success",
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo_electronico: user.correo_electronico,
        role: user.role,
        imagen_perfil: user.imagen_perfil,
        created_at: user.created_at,
        hasCV: !!userCV,
      },
    });
  } catch (error) {
    // Manejo de errores
    console.log("Error en la autenticación del usuario:", error);
    // Devuelve mensaje de error
    return res.status(500).send({
      status: "error",
      message: "Error en la autenticación del usuario",
    });
  }
};

const defaultImageUrl = "https://res.cloudinary.com/dhpapamer/image/upload/avatars/ypnrf7cejptttzjcoiqn"; // Cambia 'miusuario' por tu nombre de usuario

// Método para obtener los datos del usuario por su ID se requieren para  mostrar el perfil y la imagen
export const getUserData = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token o sesión (si ya está implementado)
    const userId = req.user.userId;

    // Buscar el usuario registrado en la base de datos por su ID y mostramos sólo los datos que queremos mostrar
    const user = await UserRegister.findById(userId).select('nombre apellido correo_electronico imagen_perfil');

    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Usuario no encontrado' 
      });
    }

    // Procesar las iniciales (tomamos la primera letra del nombre y apellido)
    const getInitials = (nombre, apellido) => {
      const firstInitial = nombre.charAt(0).toUpperCase();
      const lastInitial = apellido.charAt(0).toUpperCase();
      return firstInitial + lastInitial;
    };

    const initials = getInitials(user.nombre, user.apellido);

    // Devolver los datos del usuario junto con las iniciales y la imagen de perfil
    return res.status(200).json({
      status: 'success',
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        correo_electronico: user.correo_electronico,
        imagen_perfil: user.imagen_perfil || defaultImageUrl, // Usar la imagen de perfil o la imagen por defecto// Agregamos la ruta de la imagen de perfil
        initials: initials // Agregamos las iniciales al objeto de respuesta
      }
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error al obtener los datos del usuario' 
    });
  }
};






// Método para subir AVATAR (imagen de perfil) y actualizar el campo imagen_perfil del User
export const uploadAvatar = async (req, res) => {
  try {
    // Verificar si se ha subido un archivo
    if (!req.file) {
      return res.status(400).send({
        status: "error",
        message: "No se subió la imagen"
      });
    }

    // Obtener la URL del archivo subido a Cloudinary
    const avatarUrl = req.file.path; // Esta propiedad contiene la URL de Cloudinary

    // Guardar la imagen en la BD
    const userUpdated = await UserRegister.findByIdAndUpdate(
      req.user.userId,
      { 
        imagen_perfil: avatarUrl // Actualiza la imagen de perfil
      },
      { new: true }
    );

    // verificar si la actualización fue exitosa
    if (!userUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida de la imagen"
      });
    }

    // Devolver respuesta exitosa
    return res.status(200).json({
      status: "success",
      user: userUpdated,
      file: avatarUrl
    });

  } catch (error) {
    console.log("Error al subir archivos", error);
    return res.status(500).send({
      status: "error",
      message: "Error al subir archivos"
    });
  }
}



// Método para mostrar el AVATAR (imagen de perfil)
export const avatar = async (req, res) => {
  try {
    // Obtener el parámetro del archivo desde la url
    const userId = req.params.file;

    // Buscar al usuario en la base de datos para obtener la URL de Cloudinary
    const user = await UserRegister.findById(userId).select('imagen_perfil');

    // Verificar si el usuario existe y tiene una imagen
    if (!user || !user.imagen_perfil) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen o el usuario"
      });
    }

    // Devolver la URL de la imagen desde Cloudinary
    return res.status(200).json({
      status: "success",
      imageUrl: user.image // URL de Cloudinary almacenada en la BD
    });

  } catch (error) {
    console.log("Error al mostrar la imagen", error)
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar la imagen"
    });
  }
}

