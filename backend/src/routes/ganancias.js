import express from "express"
import gananciasController from "../controllers/gananciasController.js";
//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint.

const router = express.Router();

// Rutas principales para el endpoint /api/ganancias
// GET  /api/ganancias           Listar todos los reportes de ganancias (ventas vs gastos)
// POST /api/ganancias           Crear un nuevo registro de ganancias
router
  .route("/")
  .get(gananciasController.getAllGanancias)
  .post(gananciasController.insertGanancias)

// Rutas específicas por ID para el endpoint /api/ganancias/:id
// GET    /api/ganancias/:id     Obtener un registro de ganancia específico
// PUT    /api/ganancias/:id     Actualizar montos o recalcular ganancia
// DELETE /api/ganancias/:id     Eliminar un registro
router
  .route("/:id")
  .get(gananciasController.getGananciaById)
  .put(gananciasController.updateGanancia)
  .delete(gananciasController.deleteGanancia);

export default router;