import UserRegister from "../models/users_register.js";
import bcrypt from "bcrypt"; // Para encriptar la contraseña
import { createToken } from "../services/jwt.js";

// Método Registro de Usuarios
export const registerUser = async (req, res) => {
  try {
    // Obtener los datos de la petición
    let params = req.body;

    // Validación de los datos obtenidos
    if (
      !params.nombre ||
      !params.apellido ||
      !params.correo_electronico ||
      !params.password
    ) {
      return res.status(400).send({
        status: "error",
        message: "Todos los campos son requeridos.",
      });
    }

    // Crear el objeto de usuario con los datos que ya validamos
    let user_register = new UserRegister({
      nombre: params.nombre,
      apellido: params.apellido,
      correo_electronico: params.correo_electronico.toLowerCase(),
      password: params.password,
    });

    // Busca si ya existe un usuario con el mismo correo electrónico
    const existingUserRegister = await UserRegister.findOne({
      correo_electronico: user_register.correo_electronico,
    });

    // Si encuentra un usuario, devuelve un mensaje indicando que ya existe
    if (existingUserRegister) {
      return res.status(409).json({
        status: "error",
        message: "¡El usuario ya existe!",
      });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Genera una sal para cifrar la contraseña
    const hashedPassword = await bcrypt.hash(user_register.password, salt); // Cifra la contraseña
    user_register.password = hashedPassword; // Asigna la contraseña cifrada al usuario

    // Guardar el usuario en la base de datos
    await user_register.save();

    // Devolver el usuario registrado
    return res.status(201).json({
      status: "success",
      message: "Registro de usuario exitoso",
      user: user_register,
    });
  } catch (error) {
    // Manejo de errores
    console.log("Error en el registro de usuario:", error);
    // Devuelve mensaje de error
    return res.status(500).json({
      status: "error",
      message: "Error en el registro de usuario",
    });
  }
};

// Método de autenticación de usuarios (login) usando JWT
export const login = async (req, res) => {
  try {
    // Obtener los parámetros del body
    let params = req.body;

    // Validar parámetros: orreo_electronico, password
    if (!params.correo_electronico || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }

    // Buscar en la BD si existe el correo_electronico recibido
    const user = await UserRegister.findOne({ correo_electronico: params.correo_electronico.toLowerCase() });

    // Si no existe el usuario
    if(!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Comprobar al contraseña
    const validPassword = await bcrypt.compare(params.password, user.password);

    // Si la contraseña es incorrecta
    if(!validPassword) {
      return res.status(401).send({
        status: "error",
        message: "Contraseña incorrecta"
      });
    }

    // Generar token de autenticación
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
        created_at: user.created_at
      }
    });

  } catch (error) {
    // Manejo de errores
    console.log("Error en la autenticación del usuario:", error);
    // Devuelve mensaje de error
    return res.status(500).send({
      status: "error",
      message: "Error en la autenticación del usuario"
    });
  }
}


