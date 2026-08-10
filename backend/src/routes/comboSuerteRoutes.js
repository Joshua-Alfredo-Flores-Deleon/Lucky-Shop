import express from "express";
import comboSuerteController from "../controllers/comboSuerteController.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

// Rutas principales para el endpoint /api/comboSuerte
// GET  /api/comboSuerte          Listar todos los combos de suerte creados
// POST /api/comboSuerte          Crear un nuevo combo de suerte
router
  .route("/")
  .get(comboSuerteController.getComboSuerte)
  .post(comboSuerteController.insertComboSuerte);

// Rutas específicas por ID para el endpoint /api/comboSuerte/:id
// GET    /api/comboSuerte/:id    Obtener un combo de suerte específico por su ID
// PUT    /api/comboSuerte/:id    Actualizar un combo (añadir o quitar bolsas)
// DELETE /api/comboSuerte/:id    Eliminar el combo de suerte
router
  .route("/:id")
  .get(comboSuerteController.getComboSuerteById)
  .put(comboSuerteController.updateComboSuerte)
  .delete(comboSuerteController.deleteComboSuerte);

export default router;
