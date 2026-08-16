import { useState, useEffect } from 'react'

const BASE_URL = 'http://localhost:4000/api/productos'

// Hook para traer el listado de anillos activos, usado en la página de categoría
export const useAnillos = () => {
  // Estados del hook
  const [anillos, setAnillos] = useState([])    // Almacena la lista de anillos
  const [loading, setLoading] = useState(true)   // Indica si está cargando
  const [error, setError] = useState(null)       // Almacena errores

  useEffect(() => {
    const fetchAnillos = async () => {
      try {
        setLoading(true)
        // Petición GET con filtros: categoría=anillos y estado=activo
        const res = await fetch(`${BASE_URL}?categoria=anillos&estado=activo`, {
          credentials: 'include', // Incluye cookies para autenticación
        })
        if (!res.ok) throw new Error('Error al obtener los anillos')
        const data = await res.json()
        setAnillos(Array.isArray(data) ? data : []) // Asegura que sea un array
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los anillos')
      } finally {
        setLoading(false)
      }
    }
    fetchAnillos()
  }, []) // Se ejecuta solo una vez al montar el componente

  return { anillos, loading, error }
}

// Hook para traer el detalle de un anillo específico por su id,
// junto con productos relacionados de la misma categoría (para "ver más")
export const useAnillo = (id) => {
  const [anillo, setAnillo] = useState(null)         // Datos del producto actual
  const [relacionados, setRelacionados] = useState([]) // Productos de la misma categoría
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchAnillo = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${BASE_URL}/${id}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('No se encontró el producto')
        const data = await res.json()
        setAnillo(data)

        // Relacionados de la misma categoría
        if (data.idCategoria) {
          const resRel = await fetch(`${BASE_URL}?categoria=${data.idCategoria}&estado=activo`, {
            credentials: 'include',
          })
          if (resRel.ok) {
            const rel = await resRel.json()
            // Se excluye el producto actual y se limita a 4 relacionados
            setRelacionados(Array.isArray(rel) ? rel.filter((p) => p._id !== id).slice(0, 4) : [])
          }
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }
    fetchAnillo()
  }, [id]) // Se vuelve a ejecutar si cambia el id del producto

  return { anillo, relacionados, loading, error }
}