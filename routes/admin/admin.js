import { Router } from "express";
const router = Router();
import { crearOcupacion } from '../../controllers/admin/area_ocupacion.js';

//Rutas para administrador
router.post('/area-ocupacion', crearOcupacion);

// Exportar el Router
export default router;