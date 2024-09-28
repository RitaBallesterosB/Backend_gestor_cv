import mongoose from 'mongoose';
import { getCVData, getAreaOcupacionData } from '../userCv.js';
import UserCv from '../../models/users_cv.js';
import AreaOcupacion from '../../models/area_ocupacion.js';
import TipoAreaOcupacion from '../../models/tipo_area_ocupacion.js'; 
import Aptitud from '../../models/aptitudes.js'; 



// Método para buscar hojas de vida
export const searchCV = async (req, res) => {
    try {
        const {
            area_ocupacion,
            tipo_area_ocupacion,
            palabra_clave, // Parámetro para buscar por palabra clave
            region_residencia // Nuevo parámetro para buscar por región de residencia
        } = req.body;

        console.log("Parámetros de búsqueda:", req.body);

        // Inicializar la consulta
        const query = {};

        // Agregar filtro por área de ocupación
        if (area_ocupacion) {
            query.area_ocupacion = new mongoose.Types.ObjectId(area_ocupacion);
        }

        // Agregar filtro por tipo de área de ocupación
        if (tipo_area_ocupacion) {
            query.tipo_area_ocupacion = new mongoose.Types.ObjectId(tipo_area_ocupacion);
        }

        // Agregar filtro por región de residencia
        if (region_residencia) {
            query.region_residencia = { $regex: new RegExp(`^${region_residencia}$`, 'i') }; // 'i' para ignorar mayúsculas/minúsculas
        }
        

        // Agregar búsqueda por palabra clave en varios campos
        if (palabra_clave) {
            // Obtener los IDs de aptitudes que coinciden con la palabra clave
            const aptitudesIds = await Aptitud.find({ nombre: { $regex: palabra_clave, $options: 'i' } })
                                                .then(aptitudes => aptitudes.map(apt => apt._id));
            
           query.$or = [
        { nombre_usuario: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } },
        { apellido_usuario: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } },
        { correo_usuario: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } },
        { region_residencia: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } },
        { bio: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } }, // Búsqueda en bio
        { ocupacion: { $regex: new RegExp(`^${palabra_clave}$`, 'i') } }, // Búsqueda en ocupación
        { aptitudes: { $in: aptitudesIds } }, // Buscar en ObjectIds de aptitudes
    ];
        }

        console.log("Consulta construida:", query);

        // Ejecutar la búsqueda
        const results = await UserCv.find(query).populate(
            "area_ocupacion tipo_area_ocupacion aptitudes"
        );

        res.status(200).json({ status: "success", results });
    } catch (error) {
        console.error("Error al buscar hojas de vida:", error);
        res.status(500).json({ message: 'Error al buscar hojas de vida', error });
    }
};





// Método para obtener la hoja de vida del usuario
export const getCVDataHandler = async (req, res) => {
    try {
        const userId = req.user.userId; // Suponiendo que el ID del usuario viene del token
        const cvData = await getCVData(userId); 
        res.status(200).json({ status: 'success', cvData });
    } catch (error) {
        console.error("Error al obtener la hoja de vida:", error);
        res.status(500).json({ message: 'Error al obtener la hoja de vida', error });
    }
};

// Método para obtener áreas de ocupación
export const getAreaOcupacionDataHandler = async (req, res) => {
    try {
        const areaOcupacionData = await getAreaOcupacionData(); 
        res.status(200).json({ status: 'success', areaOcupacionData });
    } catch (error) {
        console.error("Error al obtener áreas de ocupación:", error);
        res.status(500).json({ message: 'Error al obtener áreas de ocupación', error });
    }
};

// Método para obtener tipos de área de ocupación
export const getTipoAreaOcupacionDataHandler = async (req, res) => {
    try {
        const tiposAreaOcupacionData = await TipoAreaOcupacion.find();
        res.status(200).json({ status: 'success', tiposAreaOcupacionData });
    } catch (error) {
        console.error("Error al obtener tipos de área de ocupación:", error);
        res.status(500).json({ message: 'Error al obtener tipos de área de ocupación', error });
    }
};

// Método para obtener aptitudes
export const getAptitudesDataHandler = async (req, res) => {
    try {
        const aptitudesData = await Aptitud.find();
        res.status(200).json({ status: 'success', aptitudesData });
    } catch (error) {
        console.error("Error al obtener aptitudes:", error);
        res.status(500).json({ message: 'Error al obtener aptitudes', error });
    }
};



