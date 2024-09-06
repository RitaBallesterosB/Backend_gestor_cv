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

// Crear y exportar el modelo

export default model('Aptitud', aptitudSchema, 'aptitudes'); 
