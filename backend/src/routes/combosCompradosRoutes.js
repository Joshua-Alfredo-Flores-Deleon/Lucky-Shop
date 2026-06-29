import express from "express"
import combosCompradosController from "../controllers/combosCompradosController.js"
import upload from "../utils/cloudinaryConfig.js"

const router = express.Router()

router.route("/")
.get(combosCompradosController.getAllcombosComprados)
.post(upload.single("urlVideo"), combosCompradosController.insertcombosComprados)

router.route("/:id")
.put(upload.single("urlVideo"), combosCompradosController.updatecombosComprados)
.delete(combosCompradosController.deletecombosComprados)

export default router; 