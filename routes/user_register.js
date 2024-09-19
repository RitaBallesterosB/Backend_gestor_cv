import { Router } from "express";
const router = Router();
import { ensureAuth } from '../middlewares/auth.js';
import { registerUser, login, getUserData } from '../controllers/user_register.js';
import { createCV, getUserDataForCV,getCVData } from "../controllers/userCv.js";



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

// Exportar el Router
export default router;
