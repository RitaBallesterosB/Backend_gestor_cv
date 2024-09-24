import { Router } from "express";
import multer from 'multer';
const router = Router();
import { ensureAuth } from '../middlewares/auth.js';
import { registerUser, login, getUserData } from '../controllers/user_register.js';
import { createCV, getUserDataForCV,getCVData,updateCV,deactivateCV,reactivateCV, } from "../controllers/userCv.js";

// Configuración de multer para almacenar archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/Imagen_perfil/'); // Define la carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Cambia el nombre del archivo para evitar duplicados
  }
});

const upload = multer({ storage }); // Crea una instancia de multer con la configuración de almacenamiento



// Ruta para registrar y loguear un usuario
router.post('/register', upload.single('imagen_perfil'), registerUser);

router.post('/login', login);

// Ruta para crear una hoja de vida
router.post('/hoja-de-vida',ensureAuth, createCV); 

// Ruta para obtener los datos básicos del usuario (para precargar datos del formulario de registro)
router.get('/user-data', ensureAuth, getUserData);

// Ruta para obtener los datos específicos del usuario y cargar el perfil con sus iniciales
router.get('/user-data-cv', ensureAuth, getUserDataForCV);

//Ruta para obtener los datos registrados de la hoja de vida del usuario
router.get('/ver-cv-registrado', ensureAuth, getCVData);

//Ruta para actualizar datos registrados de la hoja de vida del usuario
router.put('/modificar-cv', ensureAuth, updateCV);

// Ruta para inactivar- eliminar la hoja de vida
router.post('/desactivar-cv', ensureAuth, deactivateCV);

// Ruta para reactivar la hoja de vida
router.post('/reactivar-cv', ensureAuth, reactivateCV);




// Exportar el Router
export default router;
