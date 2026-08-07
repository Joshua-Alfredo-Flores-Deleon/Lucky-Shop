import { useState, useEffect } from 'react'

const BASE_URL = 'http://localhost:4000/api/productos'

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
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudieron cargar los productos')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()

    return () => controller.abort()
  }, [categoria])

  return { productos, loading, error }
}
