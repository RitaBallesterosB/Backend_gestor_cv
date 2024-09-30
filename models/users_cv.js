import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definir el esquema para users_cv
const userCVSchema = new Schema({
  user_register_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserRegister',
    required: true
  },

  nombre_usuario: {
    type: String,
    required: true
  },
  apellido_usuario: {
    type: String,
    required: true
  },

  correo_usuario: {
    type: String,
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
   
  },
  tiempo_experiencia: {
    type: Number, // Número
    required: true
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
  }],
  
  // certificaciones_experiencia: [{
  //   type: String, // URL de la imagen
  //   default: []
  // }],
  
  estado: {
    type: Boolean,
    default: true}
  
});

// Creación y exportación del modelo
export default model('UserCV', userCVSchema, 'users_cv');

// "UserCV" nombre del modelo lo uso para operaciones CRUD y cuando necesito el Object Id 
// userCVSchema nombre del esquema
// "users_cv" nombre de la colección en MongoDB

