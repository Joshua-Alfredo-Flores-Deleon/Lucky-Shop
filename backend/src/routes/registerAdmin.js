import express from "express"
import registerAdminController from "../controllers/registerAdminController.js"
import { validateAuthToken } from "../middlewares/validateAuthToken.js"
 
const router = express.Router();
 
router.route("/")
.post(registerAdminController.register)


router.route("/verifyCodeEmail")
.post(registerAdminController.verifyCode);

export default router;