import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definir el esquema para users_cv
const userCVSchema = new Schema({
  user_register_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserRegister',
    required: true
  },
  segundo_nombre: {
    type: String,
    maxlength: 100,
    default: null
  },
  segundo_apellido: {
    type: String,
    maxlength: 100,
    default: null
  },
  celular: {
    type: String,
    maxlength: 20,
    default: null
  },
  tipo_documento: {
    type: String,
    enum: ['CC', 'CE', 'PP'], // Ajustar según los tipos de documento necesarios
    required: true
  },
  numero_dto: {
    type: Number,
    maxlength: 30,
    unique: true,
    required: true
  },
  bio: {
    type: String,
    maxlength: 1000,
    required: true,
    default: null
  },
  ocupacion: {
    type: String,
    maxlength: 120,
    required: true,
    default: null
  },
  region_residencia: {
    type: String,
    maxlength: 120,
    required: true,
    default: null
  },
  tiempo_experiencia: {
    type: Number, // Número
    required: true
  },
  certificaciones_experiencia: {
    type: String,
    maxlength: 60,
    required: true,
    default: null
  },
  area_ocupacion: {
    type: Schema.Types.ObjectId,
    ref: 'AreaOcupacion',
    required: true
  },
  tipo_area_ocupacion: {
    type: Schema.Types.ObjectId,
    ref: 'TipoAreaOcupacion',
    required: true
  },
  aptitudes: [{
    type: Schema.Types.ObjectId,
    ref: 'Aptitud',
    required: true
  }]
});

// Creación y exportación del modelo
export default model('UserCV', userCVSchema, 'users_cv');
// "UserCV" nombre del modelo
// userCVSchema nombre del esquema
// "users_cv" nombre de la colección en MongoDB

