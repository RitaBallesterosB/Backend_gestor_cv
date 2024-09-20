import { Router } from "express";
import multer from 'multer';
const router = Router();
import { ensureAuth } from '../middlewares/auth.js';
import { registerUser, login, getUserData } from '../controllers/user_register.js';
import { createCV, getUserDataForCV,getCVData,updateCV,deactivateCV,reactivateCV,uploadCertifications } from "../controllers/userCv.js";


// Configuración de multer
const upload = multer({
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /jpg|jpeg|png|pdf/;
      const extname = filetypes.test(file.mimetype);
      if (extname) {
        return cb(null, true);
      }
      cb("Error: El archivo debe ser una imagen (jpg, jpeg, png) o un PDF.");
    }
  });


// Ruta para registrar y loguear un usuario
router.post('/register', registerUser);
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
router.post('/de-cv', ensureAuth, deactivateCV);

// Ruta para reactivar la hoja de vida
router.post('/reactivar-cv', ensureAuth, reactivateCV);

// Ruta para cargar certificaciones
router.post('/upload-certifications', ensureAuth, upload.array('certifications', 3), uploadCertifications);


// Exportar el Router
export default router;
