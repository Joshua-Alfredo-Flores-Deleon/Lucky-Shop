// Buscar.jsx — resultados de búsqueda de productos por texto
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Buscar = () => {
  const [searchParams] = useSearchParams()
  const termino = searchParams.get('q') || ''

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!termino.trim()) {
      setProductos([])
      setLoading(false)
      return
    }
    setLoading(true)
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/productos?search=${encodeURIComponent(termino)}&estado=activo`, { credentials: 'include' })
        const data = await res.json()
        setProductos(Array.isArray(data) ? data : [])
      } catch {
        setProductos([])
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [termino])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {termino ? `Resultados para "${termino}"` : 'Buscar productos'}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {loading ? 'Buscando…' : `${productos.length} resultado${productos.length !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>{termino ? 'No se encontraron productos con ese nombre' : 'Escribe algo en el buscador para empezar'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {productos.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Buscar
