// GuiaRegalo.jsx — página pública de guía de regalos
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'

const BASE_URL = 'http://localhost:4000/api'

const GuiaRegalo = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/productos?estado=activo`, { credentials: 'include' })
        const data = await res.json()
        // Mostramos solo los primeros 8 productos
        setProductos(Array.isArray(data) ? data.slice(0, 8) : [])
      } catch {
        setProductos([])
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Flecha para regresar al inicio */}
      <div className="max-w-7xl mx-auto px-8 pt-6 w-full">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-gray-900 hover:text-pink-500 font-bold text-lg transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Guía de regalo
        </Link>
      </div>

      {/* Encabezado con frase motivadora */}
      <section className="max-w-7xl mx-auto px-8 pt-8 pb-4 text-center w-full">
       <p className="text-lg sm:text-xl text-black-500 italic max-w-2xl mx-auto leading-relaxed">
          ¡Sorprende a quien amas con un detalle que brille tanto como ella!
        </p>
        <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
          Encuentra el detalle perfecto para sorprender a esa persona especial.
        </p>
      </section>

      {/* Productos */}
      <section className="max-w-7xl mx-auto px-8 py-8 w-full flex-1">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <p className="text-sm font-medium">No hay productos disponibles por ahora</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default GuiaRegalo