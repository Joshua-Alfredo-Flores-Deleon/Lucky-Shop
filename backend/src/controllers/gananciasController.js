const gananciasController = {};

//importar el schema de la coleccion que vamos a utilizar
import gananciasModel from "../models/Ganancias.js"

//GET
//select
gananciasController.getAllGanancias = async (req, res) => {
  try {
    const ganancias = await gananciasModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "ventas.idVenta",
        select: "fecha IdCarrito",
        populate: {
          path: "IdCarrito",
          select: "idCliente productos",
          populate: [
            { path: "idCliente", select: "name lastName" },
            { path: "productos.idProducto", select: "nombre" },
          ],
        },
      });
    return res.status(200).json(ganancias);
  } catch (error) {
    console.error("getAllGanancias error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//POST
//insert
gananciasController.insertGanancias = async (req, res) => {
  try {
    const { ventas, gastos, fechaMes, totalGanancias } = req.body;

    if (totalGanancias !== undefined && isNaN(totalGanancias)) {
      return res.status(400).json({ message: "Total de ganancias inválido" });
    }

    const newGanancia = new gananciasModel({ ventas, gastos, fechaMes, totalGanancias });

    await newGanancia.save();

    return res.status(201).json(newGanancia);
  } catch (error) {
    console.error("insertGanancias error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//DELETE
//ELIMINAR
gananciasController.deleteGanancia = async (req, res) => {
  try {
    const gananciaEliminada = await gananciasModel.findByIdAndDelete(req.params.id);
    if (!gananciaEliminada) {
      return res.status(404).json({ message: "Ganancia no encontrada" });
    }
    return res.status(200).json({ message: "ganancia deleted" });
  } catch (error) {
    console.error("deleteGanancia error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//PUT
//ACTUALIZAR
gananciasController.updateGanancia = async (req, res) => {
  try {
    const { ventas, gastos, fechaMes, totalGanancias } = req.body;

    if (totalGanancias !== undefined && isNaN(totalGanancias)) {
      return res.status(400).json({ message: "Total de ganancias inválido" });
    }

    const gananciaActualizada = await gananciasModel.findByIdAndUpdate(
      req.params.id,
      { ventas, gastos, fechaMes, totalGanancias },
      { new: true },
    );

    if (!gananciaActualizada) {
      return res.status(404).json({ message: "Ganancia no encontrada" });
    }

    return res.status(200).json(gananciaActualizada);
  } catch (error) {
    console.error("updateGanancia error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//SELECT POR ID
gananciasController.getGananciaById = async (req, res) => {
  try {
    const ganancia = await gananciasModel.findById(req.params.id);
    if (!ganancia) {
      return res.status(404).json({ message: "Ganancia not found " });
    }
    return res.status(200).json(ganancia);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: " Internal server error " });
  }
};

export default gananciasController;
