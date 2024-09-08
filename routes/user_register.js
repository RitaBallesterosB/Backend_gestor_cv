import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/user_register.js';


// Ruta para registrar un usuario
router.post('/register', registerUser);

// Exportar el Router
export default router;
