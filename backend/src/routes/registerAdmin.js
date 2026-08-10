// Rutas para el registro de nuevos administradores
import express from "express"
import registerAdminController from "../controllers/registerAdminController.js"
import { validateAuthToken } from "../middlewares/validateAuthToken.js"
 
const router = express.Router();
 
// POST /api/registerAdmin                  Iniciar registro de un administrador (envía código al correo)
router.route("/")
.post(registerAdminController.register)


// POST /api/registerAdmin/verifyCodeEmail  Confirmar el código y finalizar la creación de la cuenta
router.route("/verifyCodeEmail")
.post(registerAdminController.verifyCode);

export default router;