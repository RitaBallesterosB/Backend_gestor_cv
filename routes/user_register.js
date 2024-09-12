import { Router } from "express";
const router = Router();
import { registerUser, login } from '../controllers/user_register.js';


// Ruta para registrar un usuario
router.post('/register', registerUser);
router.post('/login', login);

// Exportar el Router
export default router;
