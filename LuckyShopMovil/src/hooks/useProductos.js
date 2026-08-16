/**
 * useProductos.js
 * Custom hook que obtiene los productos desde el backend (misma base de datos
 * que la app web) usando la Fetch API. Acepta filtros opcionales por categoría
 * y por texto de búsqueda, tal como los soporta el endpoint /api/productos.
 *
 * Devuelve:
 *  - productos: arreglo de productos activos
 *  - cargando:  bandera de carga para mostrar spinners
 *  - error:     mensaje de error si la petición falla
 *  - recargar:  función para volver a pedir los datos (pull-to-refresh)
 */
import { useState, useEffect, useCallback } from "react";
import { endpoints } from "../api/apiConfig";

export const useProductos = ({ categoria, search } = {}) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerProductos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      // Construimos la query string solo con los filtros presentes.
      const params = new URLSearchParams({ estado: "activo" });
      if (categoria) params.append("categoria", categoria);
      if (search) params.append("search", search);

      const res = await fetch(`${endpoints.productos}?${params.toString()}`);
      if (!res.ok) throw new Error("No se pudieron cargar los productos");

      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar los productos");
    } finally {
      setCargando(false);
    }
  }, [categoria, search]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  return { productos, cargando, error, recargar: obtenerProductos };
};

export default useProductos;
