import { Router } from "express";
const router = Router();
import { crearOcupacion } from '../../controllers/admin/area_ocupacion.js';
import { crearTipoOcupacion } from '../../controllers/admin/tipo_area_ocupacion.js';
import {crearAptitud } from '../../controllers/admin/aptitud.js';

//Rutas para administrador
router.post('/area-ocupacion', crearOcupacion);
router.post('/tipo-area-ocupacion', crearTipoOcupacion);
router.post('/aptitud', crearAptitud);

// Exportar el Router
export default router;