import express from 'express';
import connection from './database/connection.js';
import bodyParser from 'body-parser';
import cors from 'cors';


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

 //Ruta de prueba
 app.get('/ruta-prueba', (req, res) => {
    return res.status(200).json(
        {
            'id':1,
            'name': 'rita',
            'username': 'rb'
        }
    )
 })


 // Configurar el servidor Node

 app.listen (puerto, () =>  {
    console.log("Servidor de Node ejecutándose en el puerto", puerto);
    
 });

 export default app;
