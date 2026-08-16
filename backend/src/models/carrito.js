//importamos mongoose, Schema y model
import mongoose, { Schema, model } from "mongoose";

//Esquema para el Carrito de Compras de los clientes
const carritoSchema = new Schema(
  {
    idCliente: { //Referencia al cliente dueño del carrito
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    productos: [ //Arreglo de productos en el carrito
      {
        idProducto: { //Referencia al producto específico
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        cantidad: { type: Number }, //Cantidad de ese producto
        subtotal: { type: Number }, //Subtotal (precio * cantidad)
      },
    ],
    total: { type: Number }, //Total general del carrito
    estado: { type: String, default: "activo" }, //Estado del carrito (activo, completado, etc)
  },
  {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false, //Permite guardar campos que no estén definidos en el esquema
  },
);

//Exportamos el modelo con el nombre de la colección "Carrito"
export default model("Carrito", carritoSchema);
