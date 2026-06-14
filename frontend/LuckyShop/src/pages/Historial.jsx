// Historial.jsx — historial de compras del cliente
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Historial = () => {
  const navigate = useNavigate()
  const [ventas,   setVentas]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [detalle,  setDetalle]  = useState(null)

  const clienteId = sessionStorage.getItem('luckyshop_cliente_id') || localStorage.getItem('luckyshop_cliente_id')

  useEffect(() => {
    if (!clienteId) { navigate('/login'); return }

    const fetchVentas = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/venta`, { credentials: 'include' })
        const data = await res.json()
        // Filtrar ventas del cliente (por idCliente en el carrito)
        setVentas(Array.isArray(data) ? data : [])
      } catch {
        setVentas([])
      } finally {
        setLoading(false)
      }
    }
    fetchVentas()
  }, [clienteId, navigate])

  const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Historial de compras</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : ventas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3"></p>
            <p>No tienes compras registradas</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            {/* Encabezado */}
            <div className="grid grid-cols-4 bg-pink-100 px-6 py-3 text-sm font-semibold text-gray-700">
              <span className="col-span-2 text-center">Producto</span>
              <span className="text-center">Fecha</span>
              <span className="text-center">Precio</span>
              <span className="text-center sr-only">Acciones</span>
            </div>

            {/* Filas */}
            {ventas.map((venta) => (
              <div key={venta._id} className="border-b border-gray-50 last:border-0">
                <div className="grid grid-cols-5 items-center px-6 py-4">
                  {/* Imagen placeholder */}
                  <div className="col-span-1 flex justify-center">
                    <div className="w-14 h-14 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center overflow-hidden">
                      <span className="text-2xl"></span>
                    </div>
                  </div>

                  {/* Nombre/referencia */}
                  <div className="col-span-1">
                    <p className="text-sm font-medium text-gray-800">
                      {venta.referencia || `Pedido #${venta._id?.slice(-6)}`}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{venta.estado || 'pendiente'}</p>
                  </div>

                  {/* Fecha */}
                  <div className="col-span-1 text-center">
                    <p className="text-sm text-gray-600">{formatFecha(venta.fecha || venta.createdAt)}</p>
                  </div>

                  {/* Precio */}
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {venta.total ? `$${Number(venta.total).toFixed(2)}` : '—'}
                    </p>
                  </div>

                  {/* Acción */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => setDetalle(detalle?._id === venta._id ? null : venta)}
                      className="bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>

                {/* Detalle expandido */}
                {detalle?._id === venta._id && (
                  <div className="bg-pink-50 px-6 py-4 border-t border-pink-100">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Detalle del pedido</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <div><span className="font-medium">Dirección:</span> {venta.direcion || '—'}</div>
                      <div><span className="font-medium">Teléfono:</span> {venta.phone || venta.telefono || '—'}</div>
                      <div><span className="font-medium">Método de pago:</span> {venta.metodoPago || '—'}</div>
                      <div><span className="font-medium">Estado de pago:</span> {venta.statusPago ? 'Pagado' : 'Pendiente'}</div>
                      <div><span className="font-medium">Referencia:</span> {venta.referencia || '—'}</div>
                      <div><span className="font-medium">Estado:</span> <span className="capitalize">{venta.estado || '—'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Historial
