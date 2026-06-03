import express from "express"
import gastosController from "../controllers/GastosController.js";

//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(gastosController.getAllGastos)
  .post(gastosController.insertGastos)

router
  .route("/:id")
  .get(gastosController.getGastoById)
  .put(gastosController.updateGastos)
  .delete(gastosController.deleteGastos);

export default router;