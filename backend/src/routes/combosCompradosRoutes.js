import express from "express"
import combosCompradosController from "../controllers/combosCompradosController.js"
import upload from "../utils/cloudinaryConfig.js"

const router = express.Router()

// Rutas principales para el endpoint /api/combosComprados
// GET  /api/combosComprados          Listar todas las compras de combos registradas
// POST /api/combosComprados          Registrar una nueva compra y subir el video (urlVideo)
router.route("/")
.get(combosCompradosController.getAllcombosComprados)
.post(upload.single("urlVideo"), combosCompradosController.insertcombosComprados)

// Rutas específicas por ID para el endpoint /api/combosComprados/:id
// GET    /api/combosComprados/:id     Obtener el detalle de una compra específica
// PUT    /api/combosComprados/:id    Actualizar estado o reemplazar video de la compra
// DELETE /api/combosComprados/:id    Eliminar el registro de la compra
router.route("/:id")
.get(combosCompradosController.getcombosCompradosById)
.put(upload.single("urlVideo"), combosCompradosController.updatecombosComprados)
.delete(combosCompradosController.deletecombosComprados)

export default router; 