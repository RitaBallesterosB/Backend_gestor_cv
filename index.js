import express from 'express';
import connection from './database/connection.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRoutes from "./routes/user_register.js";



//Mensaje de bienvenida para verificar que ejecutó bien la API de NOde

console.log("API Node en ejecución");

// Conexión a la DB

connection();

// Crear el servidor de Node
 const app = express();
 const puerto = process.env.PORT || 3900;

 //Configuracion de las cors para hacer las peticiones correctamente

 app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, POST PATCH, DELETE'
 }));

 // Decodificar los datos desde los fromularios para convertirlos en objetos JS
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded ({extended: true}));

 //configurar rutas del aplicativo
 app.use('/api/users', UserRoutes);



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
app.post('/api/create-user-register', async (req, res) => {
   try {
       const userRegister = new UserRegister(req.body);
       await userRegister.save();
       res.status(201).send(userRegister);
   } catch (error) {
       res.status(400).send(error);
   }
});



 // Configurar el servidor Node

 app.listen (puerto, () =>  {
    console.log("Servidor de Node ejecutándose en el puerto", puerto);
    
 });

 export default app;
