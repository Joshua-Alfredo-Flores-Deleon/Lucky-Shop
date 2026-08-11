// Rutas para gestionar el perfil y los favoritos del cliente
import express from "express";
import perfilClienteController from "../controllers/perfilClienteController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

// Rutas principales para el perfil /api/perfilCliente
// GET  /api/perfilCliente           Obtener datos del cliente logueado (protegido por token)
// PUT  /api/perfilCliente           Actualizar datos y avatar del cliente (protegido por token)
router
  .route("/")
  .get(validateAuthToken("Clientes"), perfilClienteController.getMyProfile)
  .put(validateAuthToken("Clientes"), upload.single("avatar"), perfilClienteController.updateMyProfile);

// GET  /api/perfilCliente/favoritos  Obtener la lista completa de productos favoritos del cliente
router
  .route("/favoritos")
  .get(validateAuthToken("Clientes"), perfilClienteController.getFavoritos);

// POST /api/perfilCliente/favoritos/:productoId Agregar o remover un producto de los favoritos
router
  .route("/favoritos/:productoId")
  .post(validateAuthToken("Clientes"), perfilClienteController.toggleFavorito);

export default router;
