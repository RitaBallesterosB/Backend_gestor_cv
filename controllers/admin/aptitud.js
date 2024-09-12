import TipoAreaOcupacion from '../../models/tipo_area_ocupacion.js';
import Aptitud from '../../models/aptitudes.js';


// Método para crear una aptitud

export const crearAptitud =async (req, res)=> {

    try {
      const params = req.body;

      // Verificar que llegue desde el body el parámetro con el tipo área de ocupación y el nombre con su información
      if (!params.nombre || !params.tipoAreaOcupacion) {
        return res.status(400).send({
          status: "error",
          message:
            "Debes enviar el nombre de la aptitud y el tipo área de la ocupación",
        });
      }

      // Verificar si ya existe una aptitud con el mismo nombre
      const aptitudExistente = await Aptitud.findOne({ nombre: params.nombre });
      if (aptitudExistente) {
        return res.status(409).send({
          status: "error",
          message: "La aptitud ya existe en la base de datos", // Código 409 indica conflicto
        });
      }

      // Verificar si el tipo área de ocupación existe
      const tipoAreaSeleccionada = await TipoAreaOcupacion.findById(
        params.tipoAreaOcupacion
      );
      if (!tipoAreaSeleccionada) {
        return res.status(404).send({
          status: "error",
          message: "El Tipo área de Ocupación  no existe",
        });
      }

      // Crear el objeto de Aptitud y asignar la relación con el tipo área de ocupación
      let newAptitud = new Aptitud({
        nombre: params.nombre,
        tipoAreaOcupacion: params.tipoAreaOcupacion, // Asignar el ObjectId del tipo área de ocupación
        estado: params.estado !== undefined ? params.estado : true, // Manejar el estado si se envía o usar el valor por defecto
      });

      // Guardar la nueva aptituden la BD
      const aptitudStored = await newAptitud.save();

      // Verificar si se guardó la aptitud en la BD (si existe aptitudStored)
      if (!aptitudStored) {
        return res.status(500).send({
          status: "error",
          message: "No se ha guardado el tipo de  ocupación",
        });
      }

      // Devolver respuesta exitosa
      return res.status(200).send({
        status: "success",
        message: "¡Aptitud creada con éxito!",
        aptitudStored,
      });
    } catch (error) {

        return res.status(500).send({
            status: "error",
            message: "Error al crear la aptitud"
          });    
    }

}