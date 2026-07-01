import express from "express";
import bolsasController from "../controllers/bolsasController.js";
import upload from "../utils/cloudinaryConfig.js";

//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

// GET  /api/bolsas          → listar todas (con filtros opcionales: ?estado=&search=)
// POST /api/bolsas          → crear nueva bolsa (con imágenes)
router
  .route("/")
  .get(bolsasController.getBolsas)
  .post(upload.array("imagenes", 5), bolsasController.insertBolsas);

// GET    /api/bolsas/:id    → obtener una por id
// PUT    /api/bolsas/:id    → actualizar (con imágenes opcionales)
// DELETE /api/bolsas/:id    → eliminar
router
  .route("/:id")
  .get(bolsasController.getBolsaById)
  .put(upload.array("imagenes", 5), bolsasController.updateBolsas)
  .delete(bolsasController.deleteBolsas);

export default router;
