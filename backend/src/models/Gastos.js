import { Schema, model } from "mongoose";

const gastoschema = new Schema(
  {
    cantidadGasto: { type: Number },
    descripcionGasto: {type: String},
    fechaGasto: {type: Date},
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Gastos", gastoschema);