import { useState, useEffect, useMemo } from "react";

const BASE_URL = import.meta.env.VITE_API_URL + '';
const UMBRAL_STOCK_BAJO = 5;
const HORAS_RETRASO = 48;

async function obtener(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "GET", credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al consultar ${path}`);
  return Array.isArray(data) ? data : data.data ?? data;
}

/**
 * Hook de notificaciones del Panel de control.
 * Consulta tres fuentes de datos en paralelo, PERO solo cuando `activo` es true
 * (para no disparar peticiones de fondo en cada página, aunque el modal esté cerrado):
 *  - /api/venta          → pedidos con status: false  = pendientes de despachar
 *  - /api/combosComprados → combos con status: true   = cliente aceptó el video
 *  - /api/productos       → productos con stock ≤ 5   = stock bajo
 */
export function useNotificaciones(activo = true) {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activo) return;

    let vivo = true;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const [dataProductos, dataVentas, dataCombos] = await Promise.all([
          obtener("/productos"),
          obtener("/venta"),
          obtener("/combosComprados"),
        ]);
        if (!vivo) return;
        setProductos(dataProductos);
        setVentas(dataVentas);
        setCombos(dataCombos);
      } catch (err) {
        if (vivo) setError(err.message);
      } finally {
        if (vivo) setCargando(false);
      }
    }

    cargar();
    return () => {
      vivo = false;
    };
  }, [activo]);

  const notificaciones = useMemo(() => {
    const lista = [];
    const ahora = Date.now();

    // ─── 1. VIDEOS ACEPTADOS ───────────────────────────────────────────────────
    // status: true → el cliente aceptó el video de su combo de la suerte
    const videosAceptados = combos.filter((c) => c.status === true);
    if (videosAceptados.length > 0) {
      lista.push({
        id: "videos-aceptados",
        tipo: "exito",
        icono: "",
        titulo: "¡Video aceptado!",
        descripcion:
          videosAceptados.length === 1
            ? "Un cliente aceptó el video de su bolsa de la suerte."
            : `${videosAceptados.length} clientes aceptaron el video de su bolsa de la suerte.`,
        enlace: "/videosCombos",
      });
    }

    // ─── 2. PEDIDOS PENDIENTES ─────────────────────────────────────────────────
    // status: false → pedido no despachado aún
    const pedidosPendientes = ventas.filter((v) => v.status === false);

    if (pedidosPendientes.length > 0) {
      lista.push({
        id: "pedidos",
        tipo: "advertencia",
        icono: "",
        titulo: "Pedidos pendientes",
        descripcion: `Tienes ${pedidosPendientes.length} pedido${pedidosPendientes.length === 1 ? "" : "s"
          } pendiente${pedidosPendientes.length === 1 ? "" : "s"
          } de despachar. ¡Es hora de armar las bolsitas de la suerte!`,
        enlace: "/ventas",
      });
    }

    // ─── 3. PEDIDO RETRASADO (más de 48 h sin despachar) ──────────────────────
    const pedidoRetrasado = pedidosPendientes.find(
      (v) =>
        v.fecha && ahora - new Date(v.fecha).getTime() > HORAS_RETRASO * 60 * 60 * 1000
    );
    if (pedidoRetrasado) {
      lista.push({
        id: "retraso",
        tipo: "critico",
        icono: "",
        titulo: "Pedido con retraso",
        descripcion: `Un pedido lleva más de ${HORAS_RETRASO} horas sin ser despachado. La experiencia del cliente está en riesgo. Revisa el panel de ventas.`,
        enlace: "/ventas",
      });
    }

    // ─── 4. STOCK BAJO ────────────────────────────────────────────────────────
    const productosStockBajo = productos.filter(
      (p) => Number(p.stock ?? Infinity) <= UMBRAL_STOCK_BAJO
    );
    if (productosStockBajo.length > 0) {
      const primero = productosStockBajo[0];
      lista.push({
        id: "inventario",
        tipo: "advertencia",
        icono: "",
        titulo: "Stock bajo",
        descripcion:
          productosStockBajo.length === 1
            ? `El accesorio "${primero.nombre}" está por agotarse. Solo quedan ${primero.stock} unidades.`
            : `${productosStockBajo.length} accesorios están por agotarse. Revisa el inventario.`,
        enlace: "/productos",
      });
    }

    // ─── 5. FELICITACIÓN (todo en orden) ──────────────────────────────────────
    if (
      !cargando &&
      lista.length === 0 &&
      (ventas.length > 0 || combos.length > 0)
    ) {
      lista.push({
        id: "exito-total",
        tipo: "exito",
        icono: "",
        titulo: "¡Todo al día!",
        descripcion: "No tienes pedidos pendientes ni alertas de inventario. ¡Excelente trabajo!",
      });
    }

    return lista;
  }, [productos, ventas, combos, cargando]);

  return { notificaciones, cargando, error };
}