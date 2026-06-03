import express from "express"
import gananciasController from "../controllers/gananciasController.js";
//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint.

const router = express.Router();

router
  .route("/")
  .get(gananciasController.getAllGanancias)
  .post(gananciasController.insertGanancias)

router
  .route("/:id")
  .get(gananciasController.getGananciaById)
  .put(gananciasController.updateGanancia)
  .delete(gananciasController.deleteGanancia);

export default router;