import { useState, useEffect, useMemo, useCallback } from "react";

const BASE_URL = "http://localhost:4000/api";
const NOMBRES_MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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
 * Hook central de la sección Finanzas.
 * Trae ganancias y gastos desde el backend y calcula la tendencia mensual y los totales del periodo.
 */
export function useFinanzas() {
  const [ganancias, setGanancias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const [ultimoGastoGuardado, setUltimoGastoGuardado] = useState(null);

  // Carga inicial de ganancias y gastos desde el backend
  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      setCargando(true);
      setError(null);
      try {
        const [dataGanancias, dataGastos] = await Promise.all([solicitar("/ganancias"), solicitar("/gastos")]);
        if (!activo) return;
        setGanancias(Array.isArray(dataGanancias) ? dataGanancias : dataGanancias?.data || []);
        setGastos(Array.isArray(dataGastos) ? dataGastos : dataGastos?.data || []);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDatos();
    return () => {
      activo = false;
    };
  }, []);

  // Recalcula los totales del periodo cada vez que cambian las ganancias o los gastos
  const resumen = useMemo(() => {
    const ingresosTotales = ganancias.reduce((acc, g) => acc + Number(g.monto ?? g.total ?? 0), 0);
    const perdidasTotales = gastos.reduce((acc, g) => acc + Number(g.monto ?? 0), 0);
    return {
      ingresosTotales,
      perdidasTotales,
      balanceTotal: ingresosTotales - perdidasTotales,
    };
  }, [ganancias, gastos]);

  // Agrupa ganancias y gastos por mes para alimentar la gráfica de tendencia
  const tendencia = useMemo(() => {
    const mapa = new Map();

    const registrar = (fecha, campo, monto) => {
      if (!fecha) return;
      const mes = NOMBRES_MES[new Date(fecha).getMonth()];
      if (!mapa.has(mes)) mapa.set(mes, { mes, ingresos: 0, gastos: 0 });
      mapa.get(mes)[campo] += Number(monto) || 0;
    };

    ganancias.forEach((g) => registrar(g.fecha, "ingresos", g.monto ?? g.total));
    gastos.forEach((g) => registrar(g.fecha, "gastos", g.monto));

    return Array.from(mapa.values());
  }, [ganancias, gastos]);

  const registrarGasto = useCallback(async (datosGasto) => {
    const gastoCreado = await solicitar("/gastos", { method: "POST", body: datosGasto });
    setGastos((prev) => [gastoCreado, ...prev]);
    setUltimoGastoGuardado(gastoCreado);
    return gastoCreado;
  }, []);

  const limpiarUltimoGasto = useCallback(() => setUltimoGastoGuardado(null), []);

  // Combina ganancias y gastos en una sola lista de movimientos, ordenada por fecha
  const movimientos = useMemo(() => {
    const combinados = [
      ...ganancias.map((g) => ({
        id: g._id ?? g.id,
        cliente: g.cliente ?? g.nombreCliente ?? "—",
        producto: g.producto ?? "—",
        monto: Number(g.monto ?? g.total ?? 0),
        estado: g.estado ?? "Completado",
        fecha: g.fecha,
        tipo: "ganancia",
      })),
      ...gastos.map((g) => ({
        id: g._id ?? g.id,
        cliente: g.nombre,
        producto: g.categoria || "Gasto",
        monto: Number(g.monto ?? 0),
        estado: "Completado",
        fecha: g.fecha,
        tipo: "gasto",
      })),
    ];
    return combinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [ganancias, gastos]);

  const movimientosVisibles = mostrarTodo ? movimientos : movimientos.slice(0, 3);

  return {
    cargando,
    error,
    tendencia,
    resumen,
    movimientos: movimientosVisibles,
    hayMasMovimientos: movimientos.length > 3,
    mostrarTodo,
    toggleMostrarTodo: () => setMostrarTodo((v) => !v),
    registrarGasto,
    ultimoGastoGuardado,
    limpiarUltimoGasto,
  };
}