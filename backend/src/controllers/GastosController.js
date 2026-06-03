const gastosController = {};

//importar el schema de la coleccion que vamos a utilizar
import gastosModel from "../models/Gastos.js"

//GET
//select
gastosController.getAllGastos = async (req, res) => {
  const gastos = await gastosModel.find();
  res.json(gastos);
};


//POST
//insert
gastosController.insertGastos = async (req, res) => {

  //solicito los datos a guardar
  const { cantidadGasto, descripcionGasto, fechaGasto } = req.body;

  //lleno una instancia de mi squema
  const newGasto = new gastosModel({ name, description, price, stock });

  //guardo en la base de datos
  await newGasto.save();

  res.json({ message: "gasto saved" });
};

//DELETE
//ELIMINAR
gastosController.deleteGastos = async (req, res) => {
  await gastosModel.findByIdAndDelete(req.paramas.id);
  res.json({ message: "gasto deleted" });
};

//PUT
//ACTUALIZAR
gastosController.updateGastos = async (req, res) => {
  //pido los nuevos datos
  const { 
    cantidadGasto, 
    descripcionGasto,
     fechaGasto 
    } = req.body;
  //actualizo los datos
  await gastosModel.findByIdAndUpdate(
    req.params.id,
    {
      cantidadGasto, 
      descripcionGasto, 
      fechaGasto 
    },
    { new: true },
  );

  res.json({ message: " gasto updated" });
};

//SELECT POR ID
gastosController.getGastoById = async (req, res) => {
  try {
    const product = await gastosModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Gasto not found " });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: " Internal server error " });
  }
};