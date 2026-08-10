import express from "express"
import gastosController from "../controllers/GastosController.js";

//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint

const router = express.Router();

// Rutas principales para el endpoint /api/gastos
// GET  /api/gastos          Listar todos los gastos registrados
// POST /api/gastos          Registrar un nuevo gasto
router
  .route("/")
  .get(gastosController.getAllGastos)
  .post(gastosController.insertGastos)

// Rutas específicas por ID para el endpoint /api/gastos/:id
// GET    /api/gastos/:id    Obtener un gasto específico
// PUT    /api/gastos/:id    Actualizar monto, descripción o fecha del gasto
// DELETE /api/gastos/:id    Eliminar un registro de gasto
router
  .route("/:id")
  .get(gastosController.getGastoById)
  .put(gastosController.updateGastos)
  .delete(gastosController.deleteGastos);

export default router;