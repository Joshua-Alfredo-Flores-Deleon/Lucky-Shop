import express from "express";
import productosController from "../controllers/productosController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(productosController.getProductos)
  .post(productosController.insertProductos);

router
  .route("/:id")
  .delete(productosController.deleteProductos);

export default router;