import { Schema, model } from "mongoose";

const bolsasSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    descripcion: { type: String, trim: true },
    imagenes: { type: [String], default: [] },
    imagenPresentacion: { type: String, default: "" },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "agotado"],
      default: "activo",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("bolsas", bolsasSchema);
