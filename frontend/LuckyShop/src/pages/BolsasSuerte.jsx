// BolsasSuerte.jsx — página de bolsas de la suerte
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useCart } from '../context/CartContext.jsx'

const BASE_URL = 'http://localhost:4000/api'

const BolsasSuerte = () => {
  const { addItem } = useCart()
  const [bolsas,  setBolsas]  = useState([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState(false)

  useEffect(() => {
    const fetchBolsas = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/productos?categoria=bolsas&estado=activo`, { credentials: 'include' })
        const data = await res.json()
        setBolsas(Array.isArray(data) ? data : [])
      } catch {
        setBolsas([])
      } finally {
        setLoading(false)
      }
    }
    fetchBolsas()
  }, [])

  const handleAgregar = (bolsa) => {
    addItem(bolsa, 1)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-pink-500 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-medium">
          ✓ Agregado al carrito
        </div>
      )}

      {/* Banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ffd6e8 0%, #ffe0ef 40%, #fff0f6 100%)', minHeight: '180px' }}
      >
        <div className="absolute right-8 top-4 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
        <div className="container mx-auto px-6 py-8 relative z-10">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-2">Bolsa de Suerte</h1>
          <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
            Descubre el encanto de lo inesperado en cada bolsita de suerte... una selección exclusiva diseñada para sorprender y cautivar.
          </p>
        </div>
      </div>

      {/* Productos */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : bolsas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3"></p>
            <p>No hay bolsas de la suerte disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {bolsas.map((bolsa) => (
              <div key={bolsa._id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <button className="absolute top-3 right-3 z-10 text-gray-300 hover:text-pink-500 transition-colors text-xl">♡</button>
                  {bolsa.imagenPresentacion ? (
                    <img src={bolsa.imagenPresentacion} alt={bolsa.nombre} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl"></div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-800 font-medium leading-tight mb-1 line-clamp-2">{bolsa.nombre}</p>
                  <p className="text-sm font-bold text-gray-900 mb-3">${Number(bolsa.precio).toFixed(2)}</p>
                  <button
                    onClick={() => handleAgregar(bolsa)}
                    className="block w-full text-center bg-pink-100 hover:bg-pink-200 text-pink-600 text-sm font-medium py-2 rounded-full transition-colors"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default BolsasSuerte
