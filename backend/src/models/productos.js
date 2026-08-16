//importamos Schema y model de mongoose
import { Schema, model } from "mongoose";

//Esquema para los Productos del catálogo
const productSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true }, //Nombre del producto
    precio: { type: Number, required: true, min: 0 }, //Precio unitario
    stock: { type: Number, required: true, min: 0, default: 0 }, //Cantidad disponible en inventario
    descripcion: { type: String, trim: true }, //Descripción detallada
    imagenes: { type: [String], default: [] }, //Arreglo de URLs de imágenes
    imagenPresentacion: { type: String, default: "" }, //URL de la imagen principal
    favoritos: { type: [String], default: [] }, //Lista de clientes que lo marcaron como favorito
    idCategoria: { type: String, trim: true }, //ID de la categoría a la que pertenece
    subCategoria: { type: String, trim: true }, //Subcategoría
    estado: { //Estado del producto (activo, inactivo, agotado)
      type: String,
      enum: ["activo", "inactivo", "agotado"],
      default: "activo",
    },
  },
  {
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    strict: false, //Permite guardar campos que no estén definidos en el esquema
  }
);

//Exportamos el modelo con el nombre de la colección "products"
export default model("products", productSchema);
