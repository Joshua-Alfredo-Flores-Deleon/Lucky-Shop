// Rutas para la gestión de productos del catálogo
import express from "express";
import productosController from "../controllers/productosController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

// Rutas principales para el endpoint /api/productos
// GET  /api/productos           Listar todos los productos (soporta filtros: ?categoria=&estado=&search=)
// POST /api/productos          Crear nuevo producto y subir sus imágenes
router
  .route("/")
  .get(productosController.getProductos)
  .post(upload.array("imagenes", 5), productosController.insertProducto);

// Rutas específicas por ID para el endpoint /api/productos/:id
// GET    /api/productos/:id     Obtener todos los detalles de un producto específico
// PUT    /api/productos/:id    Actualizar la información de un producto (y opcionalmente sus imágenes)
// DELETE /api/productos/:id    Eliminar un producto y sus imágenes asociadas
router
  .route("/:id")
  .get(productosController.getProductoById)
  .put(upload.array("imagenes", 5), productosController.updateProducto)
  .delete(productosController.deleteProducto);

// PATCH /api/productos/:id/toggle  Alternar el estado del producto (activo <-> inactivo)
router.patch("/:id/toggle", productosController.toggleEstado);

export default router;
