//importamos Schema y model de mongoose
import { Schema, model } from "mongoose";

//Esquema para los Administradores
const adminSchema = new Schema(
  {
    name: { type: String }, //Nombre del administrador
    lastName: { type: String }, //Apellido del administrador
    email : { type: String }, //Correo electrónico
    password: { type: String }, //Contraseña encriptada
    isVerified: { type: Boolean }, //Si la cuenta está verificada
    loginAttemps: { type: Number }, //Intentos de login fallidos
    timeOut: { type: Date }, //Fecha de bloqueo temporal por intentos fallidos
  },
  {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false, //Permite guardar campos que no estén definidos en el esquema
  },
);

//Exportamos el modelo con el nombre de la colección "admins"
export default model("admins", adminSchema);