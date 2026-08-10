// Rutas de autenticación y sesión para administradores
import express from "express";
import loginAdminController from "../controllers/loginAdminController.js";

const router = express.Router();

// POST /api/loginAdmin                 Iniciar sesión y recibir token de autenticación
router.route("/").post(loginAdminController.login);

// GET  /api/loginAdmin/checkSession    Verificar si el token actual es válido y devolver datos del usuario
router.route("/checkSession").get(loginAdminController.checkSession);

export default router;