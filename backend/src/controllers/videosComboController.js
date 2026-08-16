import videosComboModel from "../models/VideosCombo.js";

const videosComboController = {};

const POPULATE_COMBO = [
  { path: "idCliente", select: "name lastName email" },
  { path: "idProducto", select: "nombre" },
];

// GET - Todos los combos (para el panel admin)
videosComboController.getVideosCombo = async (req, res) => {
  try {
    const combos = await videosComboModel
      .find()
      .sort({ createdAt: -1 })
      .populate(POPULATE_COMBO);
    return res.status(200).json(combos);
  } catch (error) {
    console.error("getVideosCombo error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET - Solo los combos del cliente autenticado (para la página pública "Videos")
videosComboController.getMisVideosCombo = async (req, res) => {
  try {
    const combos = await videosComboModel
      .find({ idCliente: req.user.id })
      .sort({ createdAt: -1 })
      .populate(POPULATE_COMBO);
    return res.status(200).json(combos);
  } catch (error) {
    console.error("getMisVideosCombo error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST - Crear un nuevo combo (admin sube el video)
videosComboController.insertVideoCombo = async (req, res) => {
  try {
    const { idCliente, idProducto, mensaje, direccion } = req.body;

    if (!idCliente) {
      return res.status(400).json({ message: "idCliente es obligatorio" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "El video es obligatorio" });
    }

    const newCombo = new videosComboModel({
      idCliente,
      idProducto,
      mensaje,
      direccion,
      urlVideo: req.file.path, // URL que devuelve Cloudinary
      status: null, // pendiente por defecto
    });

    await newCombo.save();

    const comboGuardado = await videosComboModel
      .findById(newCombo._id)
      .populate(POPULATE_COMBO);

    return res.status(201).json(comboGuardado);
  } catch (error) {
    console.error("insertVideoCombo error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH - Actualizar el status (Aceptar/Denegar), usado por el cliente
videosComboController.actualizarStatus = async (req, res) => {
  try {
    const { status } = req.body; // true o false

    // Solo el dueño del combo puede aceptarlo/denegarlo
    const combo = await videosComboModel.findById(req.params.id);
    if (!combo) {
      return res.status(404).json({ message: "Combo no encontrado" });
    }
    if (combo.idCliente.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    combo.status = status;
    await combo.save();

    const comboActualizado = await videosComboModel
      .findById(combo._id)
      .populate(POPULATE_COMBO);

    return res.status(200).json(comboActualizado);
  } catch (error) {
    console.error("actualizarStatus error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH - Actualizar el status desde el panel admin (sin validar dueño, la admin puede corregir cualquiera)
videosComboController.actualizarStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const comboActualizado = await videosComboModel
      .findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate(POPULATE_COMBO);

    if (!comboActualizado) {
      return res.status(404).json({ message: "Combo no encontrado" });
    }

    return res.status(200).json(comboActualizado);
  } catch (error) {
    console.error("actualizarStatusAdmin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE - Eliminar un combo
videosComboController.deleteVideoCombo = async (req, res) => {
  try {
    const eliminado = await videosComboModel.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ message: "Combo no encontrado" });
    }
    return res.status(200).json({ message: "Combo deleted" });
  } catch (error) {
    console.error("deleteVideoCombo error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default videosComboController;