import express from "express"
import registerAdminController from "../controllers/registerAdminController.js"
import { validateAuthToken } from "../middlewares/validateAuthToken.js"
 
const router = express.Router();
 
router.route("/")
.post(registerAdminController.register)
.get(validateAuthToken("Admin"), registerAdminController.getMyProfile);

 
router.route("/verifyCodeEmail")
.post(registerAdminController.verifyCode);

router.route("/:id")
.put(validateAuthToken("Admin"), registerAdminController.updateMyProfile);
 
 
export default router;