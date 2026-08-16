import { useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL + '/productos'

/**
 * Hook genérico para obtener productos de cualquier categoría.
 * @param {string} categoria — nombre de la categoría (ej: 'anillos', 'pulseras')
 * @returns {{ productos: Array, loading: boolean, error: string|null }}
 */
export const useCategoria = (categoria) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoria) return

    // Permite cancelar la petición si el componente se desmonta o
    // la categoría cambia antes de que termine la petición anterior
    const controller = new AbortController()

    const fetchProductos = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(
          `${BASE_URL}?categoria=${encodeURIComponent(categoria)}&estado=activo`,
          { credentials: 'include', signal: controller.signal }
        )
        if (!res.ok) throw new Error('Error al obtener los productos')
        const data = await res.json()
        setProductos(Array.isArray(data) ? data : [])
      } catch (err) {
        // Si el error es porque se canceló la petición, se ignora
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudieron cargar los productos')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()

    // Cancela la petición en curso si el efecto se vuelve a ejecutar o el componente se desmonta
    return () => controller.abort()
  }, [categoria]) // Se vuelve a ejecutar cada vez que cambia la categoría

  return { productos, loading, error }
}