import express from "express";
import carritoController from "../controllers/carritoController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

// Rutas principales para el endpoint /api/carrito
// GET  /api/carrito           Listar todos los carritos de compras
// POST /api/carrito           Crear o inicializar un nuevo carrito
router
  .route("/")
  .get(carritoController.getCarrito)
  .post(carritoController.insertCarrito);

// Rutas específicas por ID para el endpoint /api/carrito/:id
// GET    /api/carrito/:id     Obtener un carrito por su ID
// PUT    /api/carrito/:id    Actualizar los productos o el estado del carrito
// DELETE /api/carrito/:id     Eliminar el carrito
router
  .route("/:id")
  .get(carritoController.getCarritoById)
  .put(carritoController.updateCarrito)
  .delete(carritoController.deleteCarrito);

export default router;