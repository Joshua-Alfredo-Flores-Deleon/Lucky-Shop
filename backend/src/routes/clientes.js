import express from "express"
import clientesController from "../controllers/ClienteController.js";

//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(clientesController.getAllClients )

router
  .route("/:id")
  .put(clientesController.updateClients)
  .delete(bolsasController.deleteBolsas);

export default router;