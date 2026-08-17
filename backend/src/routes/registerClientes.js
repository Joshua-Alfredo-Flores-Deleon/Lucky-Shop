// Rutas para el registro de nuevos clientes
import express from "express"
import registerClientsController from "../controllers/registerClientesController.js"

const router = express.Router();

// POST /api/registerClientes                  Iniciar registro de un cliente (envía código de validación al correo)
router.route("/")
.post(registerClientsController.register);

// POST /api/registerClientes/verifyCodeEmail  Validar el código y activar la cuenta del cliente
router.route("/verifyCodeEmail")
.post(registerClientsController.verifyCode);

export default router