import { Router } from "express";
const router = Router();
import { crearOcupacion } from '../../controllers/admin/area_ocupacion.js';
import { crearTipoOcupacion } from '../../controllers/admin/tipo_area_ocupacion.js';
import {crearAptitud } from '../../controllers/admin/aptitud.js';
import { ensureAuth, ensureAdmin } from "../../middlewares/auth.js";

//Rutas para administrador
router.post('/area-ocupacion',ensureAuth, ensureAdmin, crearOcupacion);
router.post('/tipo-area-ocupacion',ensureAuth, ensureAdmin, crearTipoOcupacion);
router.post('/aptitud', ensureAuth, ensureAdmin, crearAptitud);

// Exportar el Router
export default router;