import express from "express";
import carritoController from "../controllers/carritoController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(carritoController.getCarrito)
  .post(carritoController.insertCarrito);

router
  .route("/:id")
  .delete(carritoController.deleteCarrito);

export default router;