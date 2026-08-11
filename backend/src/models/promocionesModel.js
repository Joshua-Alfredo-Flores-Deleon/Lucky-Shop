import { Schema, model } from "mongoose";

const promocionSchema = new Schema(
  {
    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "productos",
      required: true,
    },
    descuento: {
      type: Number, // porcentaje: 20 = 20% off
      required: true,
      min: 1,
      max: 99,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["activa", "inactiva"],
      default: "activa",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("promociones", promocionSchema);