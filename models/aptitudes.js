import { Schema, model } from "mongoose";

// Definir el esquema para aptitudes
const aptitudSchema = Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 45
  },
  estado: {
    type: Boolean,
    default: true
  },
  tipoAreaOcupacion: {
    type: Schema.Types.ObjectId,
    ref: 'TipoAreaOcupacion', // Nombre del modelo con el que se relaciona
    required: true
  }
});

// Crear un índice en el campo 'nombre' para optimizar las búsquedas
aptitudSchema.index({ nombre: 1 }); // Índice ascendente en el campo 'nombre'


// Crear y exportar el modelo

export default model('Aptitud', aptitudSchema, 'aptitudes'); 

//"Aptitud" nombre del modelolo uso para operaciones CRUD y cuando necesito el Object Id 
// aptitudSchema nombre del esquema
// "users_register nombre de la colección en MongoDB
