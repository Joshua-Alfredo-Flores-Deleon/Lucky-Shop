const gastosController = {};

//importar el schema de la coleccion que vamos a utilizar
import gastosModel from "../models/Gastos.js"

//GET
//select
gastosController.getAllGastos = async (req, res) => {
  try {
    const gastos = await gastosModel.find().sort({ createdAt: -1 });
    return res.status(200).json(gastos);
  } catch (error) {
    console.error("getAllGastos error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//POST
//insert
gastosController.insertGastos = async (req, res) => {
  try {
    const { cantidadGasto, descripcionGasto, fechaGasto } = req.body;

    if (cantidadGasto === undefined || isNaN(cantidadGasto) || Number(cantidadGasto) < 0) {
      return res.status(400).json({ message: "Cantidad de gasto inválida" });
    }

    const newGasto = new gastosModel({
      cantidadGasto: Number(cantidadGasto),
      descripcionGasto,
      fechaGasto,
    });

    await newGasto.save();

    return res.status(201).json(newGasto);
  } catch (error) {
    console.error("insertGastos error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//DELETE
//ELIMINAR
gastosController.deleteGastos = async (req, res) => {
  try {
    const gastoEliminado = await gastosModel.findByIdAndDelete(req.params.id);
    if (!gastoEliminado) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }
    return res.status(200).json({ message: "gasto deleted" });
  } catch (error) {
    console.error("deleteGastos error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//PUT
//ACTUALIZAR
gastosController.updateGastos = async (req, res) => {
  try {
    const { cantidadGasto, descripcionGasto, fechaGasto } = req.body;

    if (cantidadGasto !== undefined && (isNaN(cantidadGasto) || Number(cantidadGasto) < 0)) {
      return res.status(400).json({ message: "Cantidad de gasto inválida" });
    }

    const gastoActualizado = await gastosModel.findByIdAndUpdate(
      req.params.id,
      { cantidadGasto, descripcionGasto, fechaGasto },
      { new: true },
    );

    if (!gastoActualizado) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    return res.status(200).json(gastoActualizado);
  } catch (error) {
    console.error("updateGastos error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//SELECT POR ID
gastosController.getGastoById = async (req, res) => {
  try {
    const gasto = await gastosModel.findById(req.params.id);
    if (!gasto) {
      return res.status(404).json({ message: "Gasto not found " });
    }
    return res.status(200).json(gasto);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

export default gastosController;
