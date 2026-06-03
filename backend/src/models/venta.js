/**
 * idCarrito
direcion
referencia
Método de pago
estdo de pago
telefono
estado
fecha
 */
import mongoose, { Schema, model } from "mongoose";

const ventasSchema = new Schema(
  {
    IdCarrito: 
    { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carrito",
    },
    direcion: {
        type: String 
    },
    referencia : 
    { 
        type: String 
    },
    metodoPago: 
    { 
        type: String 
    },
    statusPago: 
    { 
        type: Boolean 
    },
    phone: 
    { 
        type: String 
    },
    fecha: 
    { 
        type: Date 
    },
    status: 
    { 
        type: Boolean 
    }
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Ventas", ventasSchema);