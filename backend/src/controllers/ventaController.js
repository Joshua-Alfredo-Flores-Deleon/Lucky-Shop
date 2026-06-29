const ventaController = {};

import ventaModel from "../models/venta.js";

ventaController.getVenta = async (req, res) => {
  const venta = await ventaModel.find();
  res.json(venta);
};

ventaController.insertVenta = async (req, res) => {
  const { IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status  } = req.body;
  const newVenta = new ventaModel({ IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status });
  await newVenta.save();

  res.json({ message: "Venta saved" });
};

ventaController.deleteVenta = async (req, res) => {
  await ventaModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Venta deleted" });
};

ventaController.updateVenta = async (req, res) => {
  const { IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status } = req.body;
  await ventaModel.findByIdAndUpdate(
    req.params.id,
    {
      IdCarrito,
      direcion,
      referencia,
      metodoPago,
      statusPago,
      phone,
      fecha,
      status
    },
    { new: true },
  );

  res.json({ message: "venta updated" });
};

ventaController.getVentaById = async (req, res) => {
  try {
    const venta = await ventaModel.findById(req.params.id)
    if(!venta){
      return res.status(404).json({message: "venta not found"})
    }
    return res.status(200).json(venta);
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

ventaController.searchByName = async (req, res) => {
  try {
    const { referencia } = req.body;

    const venta = await ventaModel.find({
      referencia: {$regex: referencia, $options: "i"}
    })

    if(!venta){
      return res.status(404).json({message: "not venta found"})
    }

    return res.status(200).json(venta)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

export default ventaController;