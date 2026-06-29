const gananciasController = {};

//importar el schema de la coleccion que vamos a utilizar
import gananciasModel from "../models/Ganancias.js"

//GET
//select
gananciasController.getAllGanancias = async (req, res) => {
  const ganancias = await gananciasModel.find();
  return res.status(200).json(ganancias);
};


//POST
//insert
gananciasController.insertGanancias = async (req, res) => {

  //solicito los datos a guardar
  const { ventas, gastos, fechaMes, totalGanancias } = req.body;

  //lleno una instancia de mi squema
  const newGanancia = new gananciasModel({ ventas, gastos, fechaMes, totalGanancias });

  //guardo en la base de datos
  await newGanancia.save();

  return res.status(201).json({ message: "ganancia saved" });
};

//DELETE
//ELIMINAR
gananciasController.deleteGanancia = async (req, res) => {
  await gananciasModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({ message: "ganancia deleted" });
};

//PUT
//ACTUALIZAR
gananciasController.updateGanancia = async (req, res) => {
  //pido los nuevos datos
  const { ventas, gastos, fechaMes, totalGanancias } = req.body;

  //actualizo los datos
  await gananciasModel.findByIdAndUpdate(
    req.params.id,
    { ventas,
        gastos,
        fechaMes,
        totalGanancias },
    { new: true },
  );

  return res.status(200).json({ message: "ganancia updated" });
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
