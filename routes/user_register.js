import { Router } from "express";
const router = Router();
import { ensureAuth } from '../middlewares/auth.js';
import { registerUser, login } from '../controllers/user_register.js';
import { createCV } from "../controllers/userCv.js";



// Ruta para registrar y loguear un usuario
router.post('/register', registerUser);
router.post('/login', login);

// Ruta para crear una hoja de vida
router.post('/hoja-de-vida',ensureAuth, createCV); 


// Exportar el Router
export default router;
