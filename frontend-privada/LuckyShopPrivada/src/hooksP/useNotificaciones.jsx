import { useState, useEffect, useMemo } from "react";

const BASE_URL = "http://localhost:4000/api";
const UMBRAL_STOCK_BAJO = 5;
const HORAS_RETRASO = 48;

async function obtener(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "GET", credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al consultar ${path}`);
  return Array.isArray(data) ? data : data.data ?? data;
}

/**
 * Hook de las notificaciones del Panel de control.
 * No hay endpoint de notificaciones: las alertas se calculan a partir de
 * /api/productos (stock bajo) y /api/venta (pedidos pendientes/retrasados).
 *
 * Supuestos a confirmar contra tus modelos reales:
 *  - producto.stock (o producto.cantidad) existe y es un número
 *  - venta.estado tiene el valor "Pendiente" para pedidos sin despachar
 *  - venta.cliente y venta.fecha existen (igual que en usePagos.js)
 */
export function useNotificaciones() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const [dataProductos, dataVentas] = await Promise.all([obtener("/productos"), obtener("/venta")]);
        if (!activo) return;
        setProductos(dataProductos);
        setVentas(dataVentas);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  const notificaciones = useMemo(() => {
    const lista = [];
    const ahora = Date.now();

    const pedidosPendientes = ventas.filter((v) => v.estado === "Pendiente");

    // Felicitación cuando no hay nada pendiente
    if (!cargando && ventas.length > 0 && pedidosPendientes.length === 0) {
      lista.push({
        id: "exito",
        tipo: "exito",
        titulo: "¡Excelente trabajo!",
        descripcion: "Entregaste todos los pedidos de bolsas de la suerte.",
      });
    }

    // Alerta de inventario: primer producto con stock bajo
    const productoStockBajo = productos.find((p) => Number(p.stock ?? Infinity) <= UMBRAL_STOCK_BAJO);
    if (productoStockBajo) {
      const unidades = productoStockBajo.stock;
      lista.push({
        id: "inventario",
        tipo: "advertencia",
        titulo: "Alerta de inventario",
        descripcion: `El accesorio "${productoStockBajo.nombre}" está por agotarse. Solo quedan ${unidades} unidades. Se recomienda reponer producto.`,
      });
    }

    // Nuevos pedidos pendientes de procesar
    if (pedidosPendientes.length > 0) {
      lista.push({
        id: "pedidos",
        tipo: "advertencia",
        titulo: "Nuevos pedidos",
        descripcion: `Tienes ${pedidosPendientes.length} pedido${pedidosPendientes.length === 1 ? "" : "s"} pendiente${
          pedidosPendientes.length === 1 ? "" : "s"
        } de procesar. ¡Es hora de armar las bolsitas de la suerte!`,
      });
    }

    // Pedido retrasado: pendiente con más de 48 horas desde la fecha
    const pedidoRetrasado = pedidosPendientes.find((v) => v.fecha && ahora - new Date(v.fecha).getTime() > HORAS_RETRASO * 60 * 60 * 1000);
    if (pedidoRetrasado) {
      lista.push({
        id: "retraso",
        tipo: "critico",
        titulo: "Pedido retrasado",
        descripcion: `La venta de "${pedidoRetrasado.cliente}" lleva más de 48 horas sin ser despachada. La experiencia del cliente está en riesgo. Accede al panel de ventas ahora.`,
      });
    }

    return lista;
  }, [productos, ventas, cargando]);

  return { notificaciones, cargando, error };
}