import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const ProductCard = ({ producto }) => {
  const { addItem } = useCart()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <button
          onClick={() => {}}
          className="absolute top-3 right-3 z-10 text-gray-300 hover:text-pink-500 transition-colors text-xl"
        >
          ♡
        </button>
        {producto.imagenPresentacion ? (
          <img
            src={producto.imagenPresentacion}
            alt={producto.nombre}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl"></div>
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
