import UserRegister from '../models/users_register.js';
import bcrypt from 'bcrypt'; // Para encriptar la contraseña

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
      password: params.password
    });

    // Busca si ya existe un usuario con el mismo correo electrónico
    const existingUserRegister = await UserRegister.findOne({
      correo_electronico: user_register.correo_electronico
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
      user: user_register
    });

  } catch (error) {
    // Manejo de errores
    console.log("Error en el registro de usuario:", error);
    // Devuelve mensaje de error
    return res.status(500).json({
      status: "error",
      message: "Error en el registro de usuario"
    });
  }
};
