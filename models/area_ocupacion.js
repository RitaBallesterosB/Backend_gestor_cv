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

export default model('AreaOcupacion', areaOcupacionSchema, 'area_ocupacion');

