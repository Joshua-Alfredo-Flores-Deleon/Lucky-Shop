import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    nombre: { type: String },
    precio: { type: Number },
    stock : { type: String },
    descripcion: { type: String },
    imagenPresentacion: { type: String },
    idCategoria: { type: Number },
    estado: { type: Date },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("products", productSchema);