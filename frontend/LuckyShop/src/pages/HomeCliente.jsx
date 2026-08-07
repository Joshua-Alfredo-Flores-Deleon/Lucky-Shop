// Home.jsx — página de inicio pública de Lucky Shop
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'

const BASE_URL = 'http://localhost:4000/api'

const CATEGORIAS_MENU = [
  { label: 'Anillos',    path: '/categoria/anillos',    icon: '💍' },
  { label: 'Pulseras',   path: '/categoria/pulseras',   icon: '📿' },
  { label: 'Pendientes', path: '/categoria/pendientes',  icon: '✨' },
  { label: 'Collares',   path: '/categoria/collares',   icon: '📿' },
  { label: 'Bolsas de la suerte', path: '/bolsas-suerte', icon: '🎁' },
]

const HomeCliente = () => {
  const [novedades,  setNovedades]  = useState([])
  const [anillos,    setAnillos]    = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resNov, resAni] = await Promise.all([
          fetch(`${BASE_URL}/productos?estado=activo`, { credentials: 'include' }),
          fetch(`${BASE_URL}/productos?categoria=anillos&estado=activo`, { credentials: 'include' }),
        ])
        const nov = await resNov.json()
        const ani = await resAni.json()
        setNovedades(Array.isArray(nov) ? nov.slice(0, 8) : [])
        setAnillos(Array.isArray(ani) ? ani.slice(0, 4) : [])
      } catch {
        // backend no disponible, muestra vacío
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fbc2d4 0%, #f9d0df 25%, #fce4ec 50%, #fdeef4 75%, #fff5f9 100%)',
          minHeight: '240px',
        }}
      >
        {/* Partículas bokeh */}
        <div className="bokeh-particle animate-float w-48 h-48 bg-white/20 right-[5%] top-[5%] blur-2xl" />
        <div className="bokeh-particle animate-shimmer w-32 h-32 bg-pink-200/25 right-[20%] bottom-[10%] blur-xl" />
        <div className="bokeh-particle animate-drift w-24 h-24 bg-white/15 left-[30%] top-[20%] blur-lg" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            Lucky Shop
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mb-7 font-light leading-relaxed">
            La suerte en un adorno. Descubre nuestra colección de accesorios y bolsitas sorpresa.
          </p>
          <Link
            to="/categoria/anillos"
            className="btn-pink-pulse inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-7 py-3 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
            id="hero-cta"
          >
            Ver colección
          </Link>
        </div>
      </div>

      {/* Categorías rápidas */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none justify-center">
          {CATEGORIAS_MENU.map((c) => (
            <Link
              key={c.path}
              to={c.path}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
              id={`cat-quick-${c.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-pink-100 group-hover:border-pink-400 group-hover:shadow-md group-hover:shadow-pink-100 transition-all duration-300 flex items-center justify-center text-2xl">
                {c.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-pink-500 text-center whitespace-nowrap transition-colors">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Novedades */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Novedades</h2>
          <Link to="/categoria/anillos" className="text-sm text-pink-500 hover:text-pink-600 font-medium hover:underline transition-colors">
            Ver todo →
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : novedades.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-4xl mb-3 opacity-40">✨</span>
            <p className="text-sm font-medium">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
            {novedades.map((p) => <ProductCard key={p._id} producto={p} />)}
          </div>
        )}
      </div>

      {/* Banner anillos */}
      {anillos.length > 0 && (
        <div className="bg-gradient-to-b from-pink-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Anillos destacados</h2>
              <Link to="/categoria/anillos" className="text-sm text-pink-500 hover:text-pink-600 font-medium hover:underline transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              {anillos.map((p) => <ProductCard key={p._id} producto={p} />)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default HomeCliente
