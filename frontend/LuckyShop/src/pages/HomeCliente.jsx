// Home.jsx — página de inicio pública de Lucky Shop
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import portadaJoyas from '../assets/portadaJoyas.jpg'
import promoicones from "../pages/Promociones.jsx"

const BASE_URL = 'http://localhost:4000/api'

const HomeCliente = () => {
  const [destacados, setDestacados] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${BASE_URL}/productos?estado=activo`, {
          credentials: 'include',
        })
        const data = await res.json()
        setDestacados(Array.isArray(data) ? data.slice(0, 4) : [])
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

      {/* Hero con imagen de fondo */}
      <section className="relative overflow-hidden">
        <div
          className="relative flex items-center min-h-[280px] sm:min-h-[340px]"
          style={{
            backgroundImage:
              `linear-gradient(90deg, rgba(251,194,212,0.35) 0%, rgba(251,194,212,0.05) 45%, rgba(255,255,255,0) 70%), url(${portadaJoyas})`,
            backgroundColor: '#fbc2d4',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-7xl mx-auto px-8 w-full">
            <h1
              className="text-3xl sm:text-5xl leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, color: '#4B1010' }}
            >
              <span className="block">Joyas que hablan de ti</span>
              <span className="block ml-16 sm:ml-32">sin decir una palabra</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Bienvenida */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido a tu lugar de confianza
        </h2>
        <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>
            A un espacio donde cada pieza cuenta una historia: la tuya.
          </p>
          <p>
            No son simples accesorios; diseñamos pequeños fragmentos de luz hechos
            para perdurar, celebrar tus logros y acompañarte en cada paso. Desde el
            minimalismo que te eleva en el día a día hasta la sofisticación de tus
            noches más especiales.
          </p>
          <p>
            Descubre una colección pensada para reflejar tu fuerza, tu elegancia y
            tu esencia única. Encuentra hoy esa pieza que se convertirá en parte de ti.
          </p>
        </div>
      </section>

      {/* Lo más destacado */}
      <section className="max-w-7xl mx-auto px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Lo más destacado
        </h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : destacados.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <p className="text-sm font-medium">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {destacados.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        )}
      </section>

      {/* Guía de regalo + Promociones */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Guía de regalo</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              Dilo con joyas. El regalo que no pasa de moda y se guarda para siempre.
              Encuentra el detalle ideal según su estilo.
            </p>
            <Link
              to="/guia-regalo"
              className="text-base text-pink-500 hover:text-pink-600 font-medium hover:underline transition-colors"
            >
              Ver guía →
            </Link>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Promociones</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              Una joya es buena, dos son mejor. Explora nuestros descuentos especiales.
            </p>
            <Link
              to="/promociones"
              className="text-base text-pink-500 hover:text-pink-600 font-medium hover:underline transition-colors"
            >
              Ver promos →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomeCliente;