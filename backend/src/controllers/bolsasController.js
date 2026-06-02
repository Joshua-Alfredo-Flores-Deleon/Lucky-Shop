//Creo un array de funciones
const bolsasController = {};
//importo la colección que voy a utilizar
import bolsasModel from "../models/bolsas.js";


//SELECT
bolsasController.getBolsas = async (req, res) => {
  const bolsas = await bolsasModel.find();
  res.json(bolsas);
};

//INSERTAR
bolsasController.insertbolsas = async (req, res) => {
  //#1- Solicito los datos a guardar
  const { bolsas } = req.body;

  //#2- Llenar el modelo con estos datos
  const newBolsas = new bolsasModel({ bolsas });

  //#3- Guardar todo en la base de datos
  await newBolsas.save();

  res.json({ message: "Bolsa saved" });
};

//DELETE
bolsasController.deletebolsas = async (req, res) => {
  await bolsasModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Bolsas deleted" });
};

export default bolsasController;