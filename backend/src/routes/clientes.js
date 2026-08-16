import express from "express"
import clientesController from "../controllers/clientesController.js";

//Utilizo Router() para definir los metodos (get, post, put)
//para mi endpoint

const router = express.Router();

// Rutas principales para el endpoint /api/clientes
// GET  /api/clientes          Listar todos los clientes registrados
router
  .route("/")
  .get(clientesController.getAllClients )

// Rutas específicas por ID para el endpoint /api/clientes/:id
// PUT    /api/clientes/:id     Actualizar los datos generales de un cliente (ej. hecho por un admin)
// DELETE /api/clientes/:id     Eliminar un cliente del sistema
router
  .route("/:id")
  .put(clientesController.updateClients)
  .delete(clientesController.deleteClient);

export default router;