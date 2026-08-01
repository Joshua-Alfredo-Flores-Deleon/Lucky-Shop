import { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:4000/api";

/**
 * Hook central de la sección Videos Combos.
 * Obtiene todos los combosComprados del backend y expone
 * filtrado por status, búsqueda por cliente, y operaciones
 * de actualización y eliminación.
 */
export function useVideosCombos() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // "Todos" | "Aceptada" | "Denegada"

  /* ── Fetch principal ── */
  const fetchCombos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/combosComprados`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener los videos combos");
      const data = await res.json();
      setCombos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos]);

  /* ── Filtros ── */
  const combosFiltrados = combos.filter((c) => {
    const nombreCliente =
      c.idCliente?.nombre || c.idCliente?.name || c.clienteNombre || "";

    const coincideBusqueda = nombreCliente
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideStatus =
      filtroStatus === "Todos"
        ? true
        : filtroStatus === "Aceptada"
        ? c.status === true
        : c.status === false || c.status === null || c.status === undefined;

    return coincideBusqueda && coincideStatus;
  });

  /* ── Actualizar status ── */
  const actualizarStatus = useCallback(
    async (id, status) => {
      const res = await fetch(`${BASE_URL}/combosComprados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Error al actualizar el combo");
      await fetchCombos();
    },
    [fetchCombos]
  );

  /* ── Eliminar ── */
  const eliminarCombo = useCallback(
    async (id) => {
      const res = await fetch(`${BASE_URL}/combosComprados/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al eliminar el combo");
      await fetchCombos();
    },
    [fetchCombos]
  );

  return {
    combos: combosFiltrados,
    totalCombos: combos.length,
    loading,
    error,
    busqueda,
    setBusqueda,
    filtroStatus,
    setFiltroStatus,
    fetchCombos,
    actualizarStatus,
    eliminarCombo,
  };
}
