import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv'; 

// Cargar las variables de entorno desde el archivo .env
   dotenv.config()

// Clave secreta
const secret = process.env.SECRET_KEY;

 //Generar token
 const createToken = (user)=> {
    const payload = {
        userId : user._id, 
        nombre: user.nombre, // quitar para el deploy
        apellido:user.apellido,
        correo_electronico: user.correo_electronico,
        role: user.role,
        //Fecha de emisión
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    //Devolver jwt_token codificado
    return jwt.encode(payload,secret);
 };
 
export {
    secret,
    createToken
}