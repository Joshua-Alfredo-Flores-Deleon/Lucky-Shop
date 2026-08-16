/**
 * useBolsas.js
 * Custom hook que obtiene las "Bolsas de la suerte" desde el backend
 * (endpoint /api/bolsas). Estos datos son reales y provienen de la misma base
 * de datos que utiliza la aplicación web.
 */
import { useState, useEffect, useCallback } from "react";
import { endpoints } from "../api/apiConfig";

export const useBolsas = () => {
  const [bolsas, setBolsas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerBolsas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const res = await fetch(endpoints.bolsas);
      if (!res.ok) throw new Error("No se pudieron cargar las bolsas de la suerte");

      const data = await res.json();
      // El backend puede devolver un arreglo directo o un objeto con propiedad.
      const lista = Array.isArray(data) ? data : data?.bolsas || [];
      setBolsas(lista);
    } catch (err) {
      setError(err.message || "Error al cargar las bolsas");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerBolsas();
  }, [obtenerBolsas]);

  return { bolsas, cargando, error, recargar: obtenerBolsas };
};

export default useBolsas;
