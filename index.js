import express from 'express';
import connection from './database/connection.js';
import bodyParser from 'body-parser';
import cors from 'cors';

// Importar los modelos
import UserRegister from './models/users_register.js';
import UserCV from './models/users_cv.js';
import AreaOcupacion from './models/area_ocupacion.js';
import TipoAreaOcupacion from './models/tipo_area_ocupacion.js';



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
            'name': 'carolina',
            'username': 'caro'
        }
    )
 })

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



// Endpoint de prueba para crear area_ocupacion
app.post('/api/create-area-ocupacion', async (req, res) => {
   console.log('POST /api/create-area-ocupacion'); // Log para verificar la llegada de la solicitud
   try {
       const areaOcupacion = new AreaOcupacion(req.body);
       await areaOcupacion.save();
       res.status(201).send(areaOcupacion);
   } catch (error) {
       res.status(400).send(error);
   }
});



// Endpoint de prueba para crear un CV de usuario
app.post('/api/create-user-cv', async (req, res) => {
   try {
       const userCV = new UserCV(req.body);
       await userCV.save();
       res.status(201).send(userCV);
   } catch (error) {
       res.status(400).send(error);
   }
});

// Endpoint de prueba para crear tipo_ area_ocupacion
app.post('/api/create-tipo-area-ocupacion', async (req, res) => {
    console.log('POST /api/create-tipo-area-ocupacion'); // Log para verificar la llegada de la solicitud
    try {
        const tipoAreaOcupacion = new TipoAreaOcupacion(req.body);
        await tipoAreaOcupacion.save();
        res.status(201).send(tipoAreaOcupacion);
    } catch (error) {
        res.status(400).send(error);
    }
})
 // Configurar el servidor Node

 app.listen (puerto, () =>  {
    console.log("Servidor de Node ejecutándose en el puerto", puerto);
    
 });

 export default app;
