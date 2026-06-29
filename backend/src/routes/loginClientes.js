import express from "express";
import loginClientesController from "../controllers/loginClientesController.js";

const router = express.Router();

router.route("/").post(loginClientesController.login);
router.route("/checkSession").get(loginClientesController.checkSession);

export default router;