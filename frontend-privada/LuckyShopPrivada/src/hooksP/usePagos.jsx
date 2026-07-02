import { useState, useEffect, useMemo, useCallback } from "react";

const BASE_URL = "http://localhost:4000/api";

function iniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Normaliza una venta del backend a la forma que usa la UI de Pagos.
// Ajusta los nombres de campo de la izquierda (ej. venta.cliente) si tu API usa otros.
function normalizarVenta(venta) {
  return {
    id: venta._id ?? venta.id,
    cliente: venta.cliente ?? venta.nombreCliente ?? "Cliente",
    monto: Number(venta.monto ?? venta.total ?? 0),
    metodo: venta.metodo ?? venta.metodoPago ?? "Transferencia",
    fecha: venta.fecha ?? venta.createdAt,
    producto: venta.producto ?? venta.nombreProducto ?? "—",
    detalleProducto: venta.detalleProducto ?? venta.descripcion ?? "",
    estado: venta.estado ?? "Completado",
  };
}


async function solicitar(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include", // manda la cookie authCookie
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status} al consultar ${path}`);
  }

  return data;
}

/**
 * Hook central de la sección Pagos.
 * Trae las ventas/pagos desde el backend y expone el CRUD y las estadísticas del periodo.
 */
export function usePagos() {
  const [pagos, setPagos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalPagado: 0,
    pagoPendiente: 0,
    metodoMasUsado: "—",
    usosMetodo: 0,
  });

  // Carga inicial de pagos (ventas) desde el backend
  useEffect(() => {
    let activo = true;

    async function cargarPagos() {
      setCargando(true);
      setError(null);
      try {
        const data = await solicitar("/venta");
        if (!activo) return;
        const lista = Array.isArray(data) ? data : data?.data || [];
        setPagos(lista.map(normalizarVenta));
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPagos();
    return () => {
      activo = false;
    };
  }, []);

  // Recalcula las estadísticas del periodo cada vez que cambia la lista de pagos
  useEffect(() => {
    const totalPagado = pagos.filter((p) => p.estado === "Completado").reduce((acc, p) => acc + p.monto, 0);
    const pagoPendiente = pagos.filter((p) => p.estado === "Pendiente").reduce((acc, p) => acc + p.monto, 0);

    const conteoMetodos = pagos.reduce((acc, p) => {
      acc[p.metodo] = (acc[p.metodo] || 0) + 1;
      return acc;
    }, {});
    const [metodoMasUsado, usosMetodo] = Object.entries(conteoMetodos).sort((a, b) => b[1] - a[1])[0] || ["—", 0];

    setEstadisticas({ totalPagado, pagoPendiente, metodoMasUsado, usosMetodo });
  }, [pagos]);

  const pagosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pagos;
    const termino = busqueda.toLowerCase();
    return pagos.filter((p) => p.cliente.toLowerCase().includes(termino));
  }, [pagos, busqueda]);

  const agregarPago = useCallback(async (datosPago) => {
    const ventaCreada = await solicitar("/venta", { method: "POST", body: datosPago });
    setPagos((prev) => [normalizarVenta(ventaCreada), ...prev]);
  }, []);

  const eliminarPago = useCallback(async (id) => {
    await solicitar(`/venta/${id}`, { method: "DELETE" });
    setPagos((prev) => prev.filter((p) => p.id !== id));
    setPagoAEliminar(null);
  }, []);

  return {
    pagos: pagosFiltrados,
    cargando,
    error,
    busqueda,
    setBusqueda,
    estadisticas,
    pagoSeleccionado,
    verDetalle: setPagoSeleccionado,
    cerrarDetalle: () => setPagoSeleccionado(null),
    pagoAEliminar,
    pedirConfirmacionEliminar: setPagoAEliminar,
    cancelarEliminar: () => setPagoAEliminar(null),
    agregarPago,
    eliminarPago,
    iniciales,
  };
}