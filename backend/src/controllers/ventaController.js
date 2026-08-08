import ventaModel from "../models/venta.js";
import gananciasModel from "../models/Ganancias.js";

const ventaController = {};

const POPULATE_CARRITO = {
  path: "IdCarrito",
  populate: [
    { path: "idCliente", select: "name lastName email" },
    { path: "productos.idProducto", select: "nombre precio imagenPresentacion descripcion" },
  ],
};

// A falta de un campo "estado" propio, se deriva de los dos booleanos existentes:
// status=false -> Cancelado, statusPago=false (con status activo) -> Pendiente, ambos true -> Completado
const derivarEstado = (status, statusPago) => {
  const activo = status === undefined ? true : status;
  const pagado = statusPago === undefined ? true : statusPago;
  if (!activo) return "Cancelado";
  if (!pagado) return "Pendiente";
  return "Completado";
};

const enriquecerVenta = (venta) => {
  const obj = venta.toObject ? venta.toObject() : venta;
  const carrito = obj.IdCarrito;
  const cliente = carrito?.idCliente
    ? `${carrito.idCliente.name || ""} ${carrito.idCliente.lastName || ""}`.trim()
    : "";

  return {
    ...obj,
    cliente: cliente || "Cliente",
    monto: Number(carrito?.total ?? 0),
    estado: derivarEstado(obj.status, obj.statusPago),
  };
};

// Crea o actualiza la ganancia vinculada a una venta cuando esta queda "Completado"
const sincronizarGanancia = async (ventaId, estado, monto, fecha) => {
  try {
    if (estado !== "Completado") return;

    await gananciasModel.findOneAndUpdate(
      { "ventas.idVenta": ventaId }, // busca si ya existe una ganancia para esta venta
      {
        $setOnInsert: {
          ventas: [{ idVenta: ventaId }],
          gastos: [],
          fecha: fecha || new Date(),
        },
        $set: {
          totalGanancias: monto,
        },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("sincronizarGanancia error:", error);
  }
};

ventaController.getVenta = async (req, res) => {
  try {
    const { estado, search } = req.query;

    const ventas = await ventaModel
      .find()
      .sort({ createdAt: -1 })
      .populate(POPULATE_CARRITO);

    let resultado = ventas.map(enriquecerVenta);

    if (estado) {
      resultado = resultado.filter(
        (v) => v.estado.toLowerCase() === String(estado).toLowerCase()
      );
    }

    if (search) {
      const termino = String(search).toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.cliente.toLowerCase().includes(termino) ||
          (v.referencia || "").toLowerCase().includes(termino)
      );
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("getVenta error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

ventaController.insertVenta = async (req, res) => {
  try {
    const { IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status } = req.body;
    const newVenta = new ventaModel({ IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status });
    await newVenta.save();

    const ventaGuardada = await ventaModel.findById(newVenta._id).populate(POPULATE_CARRITO);
    const ventaEnriquecida = enriquecerVenta(ventaGuardada);

    await sincronizarGanancia(ventaGuardada._id, ventaEnriquecida.estado, ventaEnriquecida.monto, ventaEnriquecida.fecha);

    return res.status(201).json(ventaEnriquecida);
  } catch (error) {
    console.error("insertVenta error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

ventaController.deleteVenta = async (req, res) => {
  try {
    const ventaEliminada = await ventaModel.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    return res.status(200).json({ message: "Venta deleted" });
  } catch (error) {
    console.error("deleteVenta error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

ventaController.updateVenta = async (req, res) => {
  try {
    const { IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status } = req.body;
    const ventaActualizada = await ventaModel.findByIdAndUpdate(
      req.params.id,
      { IdCarrito, direcion, referencia, metodoPago, statusPago, phone, fecha, status },
      { new: true },
    ).populate(POPULATE_CARRITO);

    if (!ventaActualizada) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const ventaEnriquecida = enriquecerVenta(ventaActualizada);

    await sincronizarGanancia(ventaActualizada._id, ventaEnriquecida.estado, ventaEnriquecida.monto, ventaEnriquecida.fecha);

    return res.status(200).json(ventaEnriquecida);
  } catch (error) {
    console.error("updateVenta error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

ventaController.getVentaById = async (req, res) => {
  try {
    const venta = await ventaModel.findById(req.params.id).populate(POPULATE_CARRITO);
    if (!venta) {
      return res.status(404).json({ message: "venta not found" });
    }
    return res.status(200).json(enriquecerVenta(venta));
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