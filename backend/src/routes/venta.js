// Rutas para el registro y gestión de ventas finalizadas
import express from "express";
import ventaController from "../controllers/ventaController.js";

const router = express.Router();

// Rutas principales para el endpoint /api/venta
// GET  /api/venta           Listar todas las ventas (con filtros opcionales: ?estado=&search=)
// POST /api/venta           Crear un nuevo registro de venta
router.route("/")
.get(ventaController.getVenta)
.post(ventaController.insertVenta);

// POST /api/venta/search_name Buscar ventas específicas por número/nombre de referencia
router.route("/search_name")
.post(ventaController.searchByName);

// Rutas específicas por ID para el endpoint /api/venta/:id
// GET    /api/venta/:id     Obtener todos los detalles de una venta específica
// PUT    /api/venta/:id     Actualizar estado u otros detalles de la venta
// DELETE /api/venta/:id     Eliminar un registro de venta
router.route("/:id")
.put(ventaController.updateVenta) 
.delete(ventaController.deleteVenta)
.get(ventaController.getVentaById);


export default router;