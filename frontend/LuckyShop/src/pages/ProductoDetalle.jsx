// ProductoDetalle.jsx — detalle de producto con agregar al carrito
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = 'http://localhost:4000/api'

const ProductoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  const [producto,    setProducto]    = useState(null)
  const [relacionados,setRelacionados]= useState([])
  const [loading,     setLoading]     = useState(true)
  const [cantidad,    setCantidad]    = useState(1)
  const [imgActiva,   setImgActiva]   = useState(0)
  const [toast,       setToast]       = useState(false)

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${BASE_URL}/productos/${id}`, { credentials: 'include' })
        if (!res.ok) throw new Error('no encontrado')
        const data = await res.json()
        setProducto(data)
        setImgActiva(0)

        // Relacionados de la misma categoría
        if (data.idCategoria) {
          const resRel = await fetch(`${BASE_URL}/productos?categoria=${data.idCategoria}&estado=activo`, { credentials: 'include' })
          const rel    = await resRel.json()
          setRelacionados(Array.isArray(rel) ? rel.filter((p) => p._id !== id).slice(0, 4) : [])
        }
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchProducto()
  }, [id, navigate])

  const handleAgregar = () => {
    if (!producto) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    addItem(producto, cantidad)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!producto) return null

  const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagenPresentacion].filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-pink-500 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-medium animate-bounce">
          ✓ Agregado al carrito
        </div>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 max-w-4xl mx-auto">

          {/* Imagen */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 mb-3">
              {imagenes[imgActiva] ? (
                <img
                  src={imagenes[imgActiva]}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-6xl">💍</span>
              )}
            </div>
            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex gap-2 justify-center">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgActiva(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      imgActiva === i ? 'border-pink-500' : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{producto.nombre}</h1>
            <p className="text-3xl font-black text-gray-900">${Number(producto.precio).toFixed(2)}</p>

            {producto.descripcion && (
              <p className="text-sm text-gray-600 leading-relaxed">{producto.descripcion}</p>
            )}

            {/* Stock */}
            {producto.stock <= 0 && (
              <p className="text-sm text-red-500 font-medium">Sin stock disponible</p>
            )}

            {/* Acciones */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleAgregar}
                disabled={producto.stock <= 0}
                className="flex-1 bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar al carrito
              </button>
              <button className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-xl hover:border-pink-400 hover:text-pink-500 transition-all">
                ♡
              </button>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-14 max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-5">También te puede interesar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relacionados.map((p) => <ProductCard key={p._id} producto={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ProductoDetalle
