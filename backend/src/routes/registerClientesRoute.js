import express from "express"
import registerClientsController from "../controllers/registerClientesController.js"

const router = express.Router();

router.route("/")
.post(registerClientsController.register);

router.route("/verifyCodeEmail")
.post(registerClientsController.verifyCode);

export default router