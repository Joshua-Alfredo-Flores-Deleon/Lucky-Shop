import express from "express";
import perfilClienteController from "../controllers/perfilClienteController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthToken("Clientes"), perfilClienteController.getMyProfile)
  .put(validateAuthToken("Clientes"), upload.single("avatar"), perfilClienteController.updateMyProfile);

router
  .route("/favoritos")
  .get(validateAuthToken("Clientes"), perfilClienteController.getFavoritos);

router
  .route("/favoritos/:productoId")
  .post(validateAuthToken("Clientes"), perfilClienteController.toggleFavorito);

export default router;
