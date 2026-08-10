// Ruta para cerrar sesión (limpiar cookies de autenticación)
import express from "express";
import logoutController from "../controllers/logoutController.js";

const router = express.Router();

// POST /api/logout                 Cierra la sesión activa borrando la cookie authCookie
router.route("/").post(logoutController.logout);

export default router;