import express from "express";
import promocionesController from "../controllers/promocionesController.js";

const router = express.Router();

router.route("/")
  .get(promocionesController.getPromociones)
  .post(promocionesController.insertPromocion);

router.route("/activas")
  .get(promocionesController.getPromocionesActivas);

router.route("/:id")
  .put(promocionesController.updatePromocion)
  .delete(promocionesController.deletePromocion);

router.route("/:id/toggle")
  .put(promocionesController.toggleEstado);

export default router;