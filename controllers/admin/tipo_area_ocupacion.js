import TipoAreaOcupacion from '../../models/tipo_area_ocupacion.js';
import AreaOcupacion from '../../models/area_ocupacion.js';

// Método para crear un área de ocupación

export const crearTipoOcupacion =async (req, res)=> {

    try {
      const params = req.body;

      // Verificar que llegue desde el body el parámetro con el área de ocupación y el nombre con su información
      if (!params.nombre || !params.areaOcupacion) {
        return res.status(400).send({
          status: "error",
          message: "Debes enviar el nombre y el área de ocupación",
        });
      }


      // Verificar si ya existe un TipoAreaOcupacion con el mismo nombre
    const tipoOcupacionExistente = await TipoAreaOcupacion.findOne({ nombre: params.nombre });
    if (tipoOcupacionExistente) {
      return res.status(409).send({
        status: "error",
        message: "El Tipo de Ocupación ya existe en la base de datos",
      });
    }
      // Verificar si el área de ocupación existe 
    const ocupacionSeleccionada = await AreaOcupacion.findById(params.areaOcupacion);
    if (!ocupacionSeleccionada) {
      return res.status(404).send({
        status: "error",
        message: "El Area de Ocupación  no existe"
      });
    }

      // Crear el objeto del modelo y asignar la relación con el área de ocupación
      let newTipoOcupacion = new TipoAreaOcupacion({
        nombre: params.nombre,
        areaOcupacion: ocupacionSeleccionada._id, // Asignar el ObjectId del área de ocupación

      });

    // Guardar el nuevo tipo área ocupación en la BD
    const tipoOcupacionStored = await newTipoOcupacion.save();

    // Verificar si se guardó el tipo area de ocupacion en la BD (si existe tipoOcupacionStored)
    if (!tipoOcupacionStored){
        return res.status(500).send({
          status: "error",
          message: "No se ha guardado el tipo de área ocupación"
        });
      }
  
      // Devolver respuesta exitosa 
      return res.status(200).send({
        status: "success",
        message: "¡Tipo Ocupación creada con éxito!",
        tipoOcupacionStored
      });



    } catch (error) {

        return res.status(500).send({
            status: "error",
            message: "Error al crear la ocupación"
          });    
    }


}