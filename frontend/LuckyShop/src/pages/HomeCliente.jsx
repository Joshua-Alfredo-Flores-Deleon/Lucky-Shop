// Home.jsx — página de inicio pública de Lucky Shop
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'

const BASE_URL = 'http://localhost:4000/api'

const CATEGORIAS_MENU = [
  { label: 'Anillos',    path: '/anillos',    icon: '' },
  { label: 'Pulseras',   path: '/categoria/pulseras',   icon: '' },
  { label: 'Pendientes', path: '/categoria/pendientes',  icon: '' },
  { label: 'Collares',   path: '/categoria/collares',   icon: '' },
  { label: 'Bolsas de la suerte', path: '/bolsas-suerte', icon: '' },
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
        style={{ background: 'linear-gradient(135deg, #ffd6e8 0%, #ffe8f4 50%, #fff0f6 100%)', minHeight: '220px' }}
      >
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="container mx-auto px-6 py-12 relative z-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Lucky Shop</h1>
          <p className="text-gray-600 text-sm max-w-sm mb-6">La suerte en un adorno. Descubre nuestra colección de accesorios y bolsitas sorpresa.</p>
          <Link
            to="/anillos"
            className="inline-block bg-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
          >
            Ver colección
          </Link>
        </div>
      </div>

      {/* Categorías rápidas */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIAS_MENU.map((c) => (
            <Link
              key={c.path}
              to={c.path}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-pink-100 group-hover:border-pink-400 transition-all flex items-center justify-center text-2xl">
                {c.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-pink-500 text-center whitespace-nowrap">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Novedades */}
      <div className="container mx-auto px-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Novedades</h2>
          <Link to="/anillos" className="text-sm text-pink-500 hover:underline">Ver todo</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : novedades.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No hay productos disponibles</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {novedades.map((p) => <ProductCard key={p._id} producto={p} />)}
          </div>
        )}
      </div>

      {/* Banner anillos */}
      {anillos.length > 0 && (
        <div className="bg-pink-50 py-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Anillos destacados</h2>
              <Link to="/anillos" className="text-sm text-pink-500 hover:underline">Ver todos</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
