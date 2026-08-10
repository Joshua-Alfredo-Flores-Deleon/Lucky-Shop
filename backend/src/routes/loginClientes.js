// Rutas de autenticación y sesión para clientes
import express from "express";
import loginClientesController from "../controllers/loginClientesController.js";

const router = express.Router();

// POST /api/loginClientes                 Iniciar sesión y recibir token de autenticación
router.route("/").post(loginClientesController.login);

// GET  /api/loginClientes/checkSession    Verificar si el token actual es válido y devolver datos del cliente
router.route("/checkSession").get(loginClientesController.checkSession);

export default router;