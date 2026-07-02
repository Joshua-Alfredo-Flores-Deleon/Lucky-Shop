import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useAnillos } from '../hooks/useAnillos.jsx'

const Anillos = () => {
  const { anillos, loading, error } = useAnillos()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Banner de Anillos */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ffd6e8 0%, #ffe0ef 40%, #fff0f6 100%)',
          minHeight: '200px',
        }}
      >
        {/* Adornos decorativos de fondo para estilo premium */}
        <div className="absolute right-12 top-4 w-64 h-64 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-40 bottom-2 w-48 h-48 rounded-full bg-amber-100/30 blur-2xl animate-pulse" />

        <div className="container mx-auto px-6 py-10 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-3">
              Anillos
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed font-light">
              Encuentra tu anillo que "nunca me quito" en nuestra selección de anillos, anillos de compromiso, anillos llamativos y más. Tu próxima colección de anillos favoritos comienza aquí.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-sm">Cargando anillos...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-8 text-center text-red-700 text-sm">
            <p className="font-semibold mb-2">Hubo un problema al cargar los productos</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : anillos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4"></span>
            <p className="text-sm">No hay anillos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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
