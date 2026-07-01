import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Carrito = () => {
  const { items, removeItem, updateCantidad, total, clearCart } = useCart()
  const { cliente } = useAuth()
  const [loading, setLoading]  = useState(false)
  const [error,   setError]    = useState('')
  const [success, setSuccess]  = useState(false)

  const COSTO_ENVIO = items.length > 0 ? 4.00 : 0
  const totalFinal  = total + COSTO_ENVIO

  const handleComprar = async () => {
    // No debería ocurrir: esta página ya está protegida por PrivateRoute,
    // pero validamos igual antes de golpear el backend.
    const clienteId = cliente?._id
    if (!clienteId) {
      setError('Debes iniciar sesión para completar la compra')
      return
    }

    setError('')
    setLoading(true)

    try {
      // 1. Crear carrito en el backend
      const carritoPayload = {
        idCliente: clienteId,
        productos: items.map((i) => ({
          idProducto: i._id,
          cantidad:   i.cantidad,
          subtotal:   i.precio * i.cantidad,
        })),
        total: totalFinal,
        estado: 'activo',
      }

      const resCarrito = await fetch(`${BASE_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ carrito: carritoPayload }),
      })

      if (!resCarrito.ok) throw new Error('Error al procesar el carrito')
      const carritoData = await resCarrito.json()

      // 2. Crear venta
      const ventaPayload = {
        IdCarrito:  carritoData._id || carritoData.id,
        metodoPago: 'pendiente',
        statusPago: false,
        fecha:      new Date().toISOString(),
        estado:     'pendiente',
      }

      const resVenta = await fetch(`${BASE_URL}/venta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ventaPayload),
      })

      if (!resVenta.ok) throw new Error('Error al crear la venta')

      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Error al procesar la compra')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h2>
        <p className="text-gray-500 mb-6">Tu pedido ha sido registrado correctamente.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-pink-600 transition-colors">
            Volver al inicio
          </Link>
          <Link to="/historial" className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-50 transition-colors">
            Ver mis pedidos
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrito de compras</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 mb-6">Tu carrito está vacío</p>
            <Link to="/" className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-pink-600 transition-colors">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Lista de productos */}
            <div className="flex-1">
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                {/* Encabezado tabla */}
                <div className="grid grid-cols-4 bg-pink-100 px-5 py-3 text-sm font-semibold text-gray-700">
                  <span className="col-span-2">Productos</span>
                  <span className="text-center">Cantidad</span>
                  <span className="text-center">Acción</span>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <div key={item._id} className="grid grid-cols-4 items-center px-5 py-4 border-b border-gray-50 last:border-0">
                    {/* Producto */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        {item.imagenPresentacion ? (
                          <img src={item.imagenPresentacion} alt={item.nombre} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">💍</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{item.nombre}</p>
                        <p className="text-sm font-bold text-gray-900">${Number(item.precio).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateCantidad(item._id, item.cantidad - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-pink-400 hover:text-pink-500 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.cantidad}</span>
                      <button
                        onClick={() => updateCantidad(item._id, item.cantidad + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-pink-400 hover:text-pink-500 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Eliminar */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl"
                        title="Eliminar"
                      >
                        
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:w-72">
              <div className="rounded-2xl border border-gray-100 p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Resumen de pedido</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Costo de envío</span>
                    <span className="font-medium text-gray-900">${COSTO_ENVIO.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalFinal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">El impuesto y costo de envío se calcula en el pago</p>
                </div>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <button
                  onClick={handleComprar}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Procesando...' : 'Comprar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Carrito
