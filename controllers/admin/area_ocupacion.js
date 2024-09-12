import AreaOcupacion from '../../models/area_ocupacion.js';

// Método para crear un área de ocupación

export const crearOcupacion =async (req, res)=> {

    try {
      const params = req.body;

      // Verificar que llegue desde el body el parámetro nombre con su información
      if (!params.nombre) {
        return res.status(400).send({
          status: "error",
          message: "Debes enviar el nombre de la ocupación",
        });
      }

      // Crear el objeto del modelo
    let newAreaOcupacion = new AreaOcupacion(params);

    // Guardar la nueva publicación en la BD
    const ocupacionStored = await newAreaOcupacion.save();

    // Verificar si se guardó la publicación en la BD (si existe publicationStored)
    if (!ocupacionStored){
        return res.status(500).send({
          status: "error",
          message: "No se ha guardado la ocupación"
        });
      }
  
      // Devolver respuesta exitosa 
      return res.status(200).send({
        status: "success",
        message: "¡Ocupación creada con éxito!",
        ocupacionStored
      });



    } catch (error) {

        return res.status(500).send({
            status: "error",
            message: "Error al crear la ocupación"
          });    
    }


}