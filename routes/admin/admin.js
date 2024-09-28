import { Router } from "express";
const router = Router();

import { crearOcupacion } from '../../controllers/admin/area_ocupacion.js';
import { crearTipoOcupacion } from '../../controllers/admin/tipo_area_ocupacion.js';
import { crearAptitud } from '../../controllers/admin/aptitud.js';
import { ensureAuth, ensureAdmin } from "../../middlewares/auth.js";
import { searchCV, getCVDataHandler,getAreaOcupacionDataHandler } from "../../controllers/admin/search_controller.js"; 
import { validateSearchParams } from "../../middlewares/validateSearchParams.js";


// Rutas para administrador
router.post('/area-ocupacion', ensureAuth, ensureAdmin, crearOcupacion);
router.post('/tipo-area-ocupacion', ensureAuth, ensureAdmin, crearTipoOcupacion);
router.post('/aptitud', ensureAuth, ensureAdmin, crearAptitud);

// Nueva ruta para búsqueda de CV
router.post('/buscar-cv', ensureAuth, ensureAdmin,validateSearchParams,searchCV); 

// Ruta para obtener la hoja de vida del usuario
router.get('/cv', ensureAuth, ensureAdmin, getCVDataHandler); 

// Ruta para obtener áreas de ocupación
router.get('/areas-ocupacion', ensureAuth, ensureAdmin, getAreaOcupacionDataHandler); 

// Exportar el Router
export default router;
