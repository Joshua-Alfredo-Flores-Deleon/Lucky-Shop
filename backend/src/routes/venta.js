import express from "express";
import ventaController from "../controllers/ventaController.js";

const router = express.Router();

router.route("/")
.get(ventaController.getVenta)
.post(ventaController.insertVenta);

router.route("/search_name")
.post(ventaController.searchByName);

router.route("/:id")
.put(ventaController.updateVenta) 
.delete(ventaController.deleteVenta)
.get(ventaController.getVentaById);


export default router;