import { Router } from "express";
const router = Router();
import { registerUser, login } from '../controllers/user_register.js';
import { crearOcupacion } from "../controllers/area_ocupacion.js";


// Ruta para registrar un usuario
router.post('/register', registerUser);
router.post('/login', login);
router.post('/area-ocupacion', crearOcupacion);

// Exportar el Router
export default router;
