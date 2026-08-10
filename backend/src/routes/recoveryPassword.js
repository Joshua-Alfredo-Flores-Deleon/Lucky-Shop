// Rutas para la recuperación de contraseñas de clientes
import express from "express";

import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

// POST /api/recoveryPassword/requestCode   Enviar código de recuperación al correo del cliente
router.route("/requestCode")
.post(recoveryPasswordController.requestCode);

// POST /api/recoveryPassword/verifyCode    Validar el código ingresado por el cliente
router.route("/verifyCode")
.post(recoveryPasswordController.verifyCode);

// POST /api/recoveryPassword/newPassword   Guardar la nueva contraseña del cliente (si el código fue validado)
router.route("/newPassword")
.post(recoveryPasswordController.newPassword);

export default router;