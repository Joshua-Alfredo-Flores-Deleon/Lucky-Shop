import { Schema, model } from "mongoose";

const clienteSchema = new Schema(
  {
    name: { type: String },
    birthdate: { type: Date },
    email : { type: String },
    password: { type: String },
    isVerified: { type: Boolean },
    loginAttemps: { type: Number },
    timeOut: { type: Date },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Clientes", clienteSchema);