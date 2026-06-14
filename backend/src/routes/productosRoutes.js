import express from "express";
import productosController from "../controllers/productosController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

// GET  /api/productos          → listar todos (con filtros opcionales: ?categoria=&estado=&search=)
// POST /api/productos          → crear nuevo producto (con imágenes)
router
  .route("/")
  .get(productosController.getProductos)
  .post(upload.array("imagenes", 5), productosController.insertProducto);

// GET    /api/productos/:id    → obtener uno por id
// PUT    /api/productos/:id    → actualizar (con imágenes opcionales)
// DELETE /api/productos/:id    → eliminar
router
  .route("/:id")
  .get(productosController.getProductoById)
  .put(upload.array("imagenes", 5), productosController.updateProducto)
  .delete(productosController.deleteProducto);

// PATCH /api/productos/:id/toggle → activar/inactivar
router.patch("/:id/toggle", productosController.toggleEstado);

export default router;
