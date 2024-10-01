import { Router } from "express";
import multer from 'multer';
const router = Router();
import { ensureAuth } from '../middlewares/auth.js';
import { registerUser, login, getUserData,uploadAvatar, avatar } from '../controllers/user_register.js';
import { createCV, getUserDataForCV,getCVData,updateCV,deactivateCV,reactivateCV,getAreaOcupacionData } from "../controllers/userCv.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';


// Configuración de subida de archivos en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
    public_id: (req, file) => 'avatar-' + Date.now()
  }
});

// Configurar multer con límites de tamaño
const uploads = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }  // Limitar tamaño a 1 MB
});



// Ruta para registrar y loguear un usuario
router.post('/register', [uploads.single("file0")], registerUser);


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

// Ruta para obtener los datos de áreas de ocupación
router.get('/get-areas-ocupacion', ensureAuth, getAreaOcupacionData); 






// Exportar el Router
export default router;
