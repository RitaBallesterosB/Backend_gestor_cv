import { Schema, model } from 'mongoose';

const areaOcupacionSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 45
  },
  estado: {
    type: Boolean,
    default: true
  }
});

// Crear un índice en el campo 'nombre'
areaOcupacionSchema.index({ nombre: 1 }); // 1 para índice ascendente, -1 para descendente


export default model('AreaOcupacion', areaOcupacionSchema, 'area_ocupacion');

//"AreaOcupacion" nombre del modelo - lo uso para operaciones CRUD y cuando necesito el Object Id 
// reaOcupacionSchema nombre del esquema
// "area_ocupacion nombre de la colección en MongoDB