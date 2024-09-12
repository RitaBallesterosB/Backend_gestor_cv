import { Router } from "express";
const router = Router();
import { crearOcupacion } from '../../controllers/admin/area_ocupacion.js';
import { crearTipoOcupacion } from '../../controllers/admin/tipo_area_ocupacion.js';

//Rutas para administrador
router.post('/area-ocupacion', crearOcupacion);
router.post('/tipo-area-ocupacion', crearTipoOcupacion);

// Exportar el Router
export default router;