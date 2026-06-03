import mongoose, { Schema, model } from "mongoose";

const carritoSchema = new Schema(
  {
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    productos: [
      {
        idProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        cantidad: { type: Number },
        subtotal: { type: Number },
      },
    ],
    total: { type: Number },
    estado: { type: String, default: "activo" },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Carrito", carritoSchema);
