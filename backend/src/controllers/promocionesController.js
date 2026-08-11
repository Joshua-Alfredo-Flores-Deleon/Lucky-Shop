import promocionesModel from "../models/promocionesModel.js";

const promocionesController = {};

// GET ALL — para el apartado de promociones del admin
promocionesController.getPromociones = async (req, res) => {
  try {
    const promociones = await promocionesModel
      .find()
      .populate("idProducto")
      .sort({ createdAt: -1 });
    return res.status(200).json(promociones);
  } catch (error) {
    console.error("getPromociones error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ACTIVAS — solo las vigentes hoy (para el carrito / tienda)
promocionesController.getPromocionesActivas = async (req, res) => {
  try {
    const ahora = new Date();
    const promociones = await promocionesModel
      .find({
        estado: "activa",
        fechaInicio: { $lte: ahora },
        fechaFin: { $gte: ahora },
      })
      .populate("idProducto");
    return res.status(200).json(promociones);
  } catch (error) {
    console.error("getPromocionesActivas error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// INSERT
promocionesController.insertPromocion = async (req, res) => {
  try {
    let { idProducto, descuento, fechaInicio, fechaFin } = req.body;

    if (!idProducto || descuento === undefined || !fechaInicio || !fechaFin) {
      return res
        .status(400)
        .json({ message: "Producto, descuento y fechas son requeridos" });
    }

    if (isNaN(descuento) || descuento < 1 || descuento > 99) {
      return res.status(400).json({ message: "Descuento inválido (1-99)" });
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return res
        .status(400)
        .json({ message: "La fecha fin no puede ser anterior a la de inicio" });
    }

    const newPromocion = new promocionesModel({
      idProducto,
      descuento: Number(descuento),
      fechaInicio,
      fechaFin,
      estado: "activa",
    });

    await newPromocion.save();
    return res.status(201).json({
      message: "Promoción creada exitosamente",
      promocion: newPromocion,
    });
  } catch (error) {
    console.error("insertPromocion error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE
promocionesController.deletePromocion = async (req, res) => {
  try {
    const promocion = await promocionesModel.findByIdAndDelete(req.params.id);
    if (!promocion) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }
    return res
      .status(200)
      .json({ message: "Promoción eliminada exitosamente" });
  } catch (error) {
    console.error("deletePromocion error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// TOGGLE ESTADO
promocionesController.toggleEstado = async (req, res) => {
  try {
    const promocion = await promocionesModel.findById(req.params.id);
    if (!promocion) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }
    promocion.estado = promocion.estado === "activa" ? "inactiva" : "activa";
    await promocion.save();
    return res.status(200).json({
      message: `Promoción ${promocion.estado}`,
      estado: promocion.estado,
    });
  } catch (error) {
    console.error("toggleEstado error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default promocionesController;