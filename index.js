import express from 'express';
import connection from './database/connection.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRoutes from "./routes/user_register.js";
import AdminRoutes from "./routes/admin/admin.js"
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//Mensaje de bienvenida para verificar que ejecutó bien la API de NOde

console.log("API Node en ejecución");

// Conexión a la DB

connection();

// Crear el servidor de Node
 const app = express();
 const puerto = process.env.PORT || 3900;

 // Configurar cors para hacer las peticiones correctamente
app.use(cors({
   origin: '*', // Permitir solicitudes desde cualquier origen
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
   preflightContinue: false,
   optionsSuccessStatus: 204
 }));

 // Decodificar los datos desde los fromularios para convertirlos en objetos JS
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded ({extended: true}));

 //configurar rutas del aplicativo
 app.use('/api/user', UserRoutes);
 app.use('/api/admin', AdminRoutes);


//  //Ruta de prueba
//  app.get('/ruta-prueba', (req, res) => {
//     return res.status(200).json(
//         {
//             'id':1,
//             'name': 'carolina',
//             'username': 'caro'
//         }
//     )
//  })

 // Endpoint de prueba  para crear un usuario registrado
// app.post('/api/create-user-register', async (req, res) => {
//    try {
//        const userRegister = new UserRegister(req.body);
//        await userRegister.save();
//        res.status(201).send(userRegister);
//    } catch (error) {
//        res.status(400).send(error);
//    }
// });



 // Configurar el servidor Node

 app.listen (puerto, () =>  {
    console.log("Servidor de Node ejecutándose en el puerto", puerto);
    
 });

 export default app;
