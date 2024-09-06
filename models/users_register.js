import { Schema, model } from "mongoose";

// Define el esquema del modelo
const userRegisterSchema = Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 60
  },
  apellido: {
    type: String,
    required: true,
    maxlength: 60
  },
  correo_electronico: {
    type: String,
    required: true,
    maxlength: 120,
    unique: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 12
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['usuario', 'ADMIN'],
    required: true
  }
});

// Crea el modelo a partir del esquema
export default model('UserRegister', userRegisterSchema, 'users_register');
//"UserRegister" nombre del modelo
// UserSchema nombre del esquema
// "users_register nombre de la colección en MongoDB"


