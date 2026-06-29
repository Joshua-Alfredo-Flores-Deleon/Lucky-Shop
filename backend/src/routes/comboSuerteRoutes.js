import express from "express";
import comboSuerteController from "../controllers/comboSuerteController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(comboSuerteController.getComboSuerte)
  .post(comboSuerteController.insertComboSuerte);

router
  .route("/:id")
  .delete(comboSuerteController.deleteComboSuerte);

export default router;
