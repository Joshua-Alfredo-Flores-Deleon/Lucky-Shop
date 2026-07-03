import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = 'http://localhost:4000/api'

const ProductCard = ({ producto }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [esFavorito, setEsFavorito] = useState(false)
  const [cargandoFav, setCargandoFav] = useState(false)

  // Si el producto ya trae si es favorito (por ejemplo, listado desde /favoritos), lo respetamos
  useEffect(() => {
    if (producto.esFavorito !== undefined) setEsFavorito(producto.esFavorito)
  }, [producto])

  const handleToggleFavorito = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    setCargandoFav(true)
    try {
      const res = await fetch(`${BASE_URL}/perfilCliente/favoritos/${producto._id}`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) setEsFavorito(data.esFavorito)
    } catch {
      // si falla, dejamos el estado como estaba
    } finally {
      setCargandoFav(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <button
          onClick={handleToggleFavorito}
          disabled={cargandoFav}
          className={`absolute top-3 right-3 z-10 text-xl transition-colors ${
            esFavorito ? 'text-pink-500' : 'text-gray-300 hover:text-pink-500'
          }`}
        >
          {esFavorito ? '♥' : '♡'}
        </button>
        {producto.imagenPresentacion ? (
          <img
            src={producto.imagenPresentacion}
            alt={producto.nombre}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">💍</div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-gray-800 font-medium leading-tight mb-1 line-clamp-2">{producto.nombre}</p>
        <p className="text-sm font-bold text-gray-900 mb-3">${Number(producto.precio).toFixed(2)}</p>
        <Link
          to={`/producto/${producto._id}`}
          className="block w-full text-center bg-pink-100 hover:bg-pink-200 text-pink-600 text-sm font-medium py-2 rounded-full transition-colors"
        >
          Ver más
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
