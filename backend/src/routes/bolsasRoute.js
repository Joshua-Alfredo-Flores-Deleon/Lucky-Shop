import express from "express";
import bolsasController from "../controllers/bolsasController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(bolsasController.getBolsas)
  .post(bolsasController.insertbolsas);

router
  .route("/:id")
  .delete(bolsasController.deletebolsas);

export default router;
