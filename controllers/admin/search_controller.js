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
        nombre,
        apellidos,
        email,
        area_ocupacion,
        tipo_area_ocupacion,
        aptitudes,
        region_residencia,
        numero_documento,
        tiempo_experiencia = null // Asignar un valor predeterminado
      } = req.body;

      // Log para verificar los parámetros recibidos
      console.log("Parámetros de búsqueda:", req.body);

      // Construir la consulta
      const query = {};
      if (nombre) query.nombre_usuario = { $regex: nombre, $options: "i" }; // Campo: nombre_usuario
      if (apellidos)
        query.apellido_usuario = { $regex: apellidos, $options: "i" }; // Campo: apellido_usuario
      if (email) query.correo_usuario = { $regex: email, $options: "i" }; // Campo: correo_usuario
      if (region_residencia)
        query.region_residencia = { $regex: region_residencia, $options: "i" }; // Campo: region_residencia
      if (numero_documento) query.numero_dto = numero_documento; // Campo: numero_dto

      // Convertir area_ocupacion a ObjectId
      if (area_ocupacion) {
        query.area_ocupacion = new mongoose.Types.ObjectId(area_ocupacion);
      }

      // Convertir tipo_area_ocupacion a ObjectId
      if (tipo_area_ocupacion) {
        query.tipo_area_ocupacion =
          new mongoose.Types.ObjectId(tipo_area_ocupacion);
      }

      // Convertir aptitudes a ObjectIds
      if (aptitudes && aptitudes.length > 0) {
        query.aptitudes = {
          $in: aptitudes.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }

      // Agregar filtro por tiempo de experiencia si es necesario
      if (tiempo_experiencia) {
        query.tiempo_experiencia = tiempo_experiencia; // Suponiendo que este campo existe
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



