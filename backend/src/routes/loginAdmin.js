import express from "express";
import loginAdminController from "../controllers/loginAdminController.js";

const router = express.Router();

router.route("/").post(loginAdminController.login);
router.route("/checkSession").get(loginAdminController.checkSession);

export default router;