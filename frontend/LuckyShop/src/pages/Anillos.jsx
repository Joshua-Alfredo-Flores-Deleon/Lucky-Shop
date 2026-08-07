// Anillos.jsx — página dedicada a la categoría de anillos
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CategoryBanner from '../components/CategoryBanner.jsx'
import { useCategoria } from '../hooks/useCategoria.jsx'

const Anillos = () => {
  // Hook genérico reutilizable
  const { productos: anillos, loading, error } = useCategoria('anillos')

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Banner de Anillos */}
      <CategoryBanner
        titulo="Anillos"
        descripcion='Encuentra tu anillo que "nunca me quito" en nuestra selección de anillos, anillos de compromiso, anillos llamativos y más. Tu próxima colección de anillos favoritos comienza aquí.'
      />

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-sm font-medium">Cargando anillos...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-8 text-center text-red-700 text-sm">
            <p className="font-semibold mb-2">Hubo un problema al cargar los productos</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : anillos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4 opacity-40">💍</span>
            <p className="text-sm font-medium">No hay anillos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
            {anillos.map((anillo) => (
              <ProductCard key={anillo._id} producto={anillo} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Anillos
