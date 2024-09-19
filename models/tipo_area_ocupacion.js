import { Schema, model } from "mongoose";

// Definir el esquema para tipo_area_ocupacion
const tipoAreaOcupacionSchema = Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 45
  },
  estado: {
    type: Boolean,
    default: true
  },
  areaOcupacion: {
    type: Schema.Types.ObjectId,
    ref: 'AreaOcupacion', // Nombre del modelo con el que se relaciona
    required: true
  }
});
// Crear un índice en el campo 'nombre'
tipoAreaOcupacionSchema.index({ nombre: 1 }); // 1 para índice ascendente

// Crear y exportar el modelo
;

export default model("TipoAreaOcupacion", tipoAreaOcupacionSchema,"tipo_area_ocupacion") ;

//"TipoAreaOcupacion" nombre del modelo lo uso para operaciones CRUD y cuando necesito el Object Id 
// tipoAreaOcupacionSchema nombre del esquema
// "tipo_area_ocupacion nombre de la colección en MongoDB