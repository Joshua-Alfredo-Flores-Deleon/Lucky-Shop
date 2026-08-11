import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Pago = () => {
  const { items, total, clearCart } = useCart()
  const { cliente } = useAuth()
  const navigate = useNavigate()

  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [direccionEnvio, setDireccionEnvio] = useState('misma')

  // Estado para la edición de la dirección predeterminada en línea
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editedAddress, setEditedAddress] = useState(cliente?.direccion || 'Calle 4 de noviembre, colonia 5 de mayo, San Salvador')

  // Estado del formulario de tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [nombreTarjeta, setNombreTarjeta] = useState('')
  const [fechaExpiracion, setFechaExpiracion] = useState('')
  const [cvv, setCvv] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Costo de envío siempre $4.00 si hay items
  const COSTO_ENVIO = items.length > 0 ? 4.00 : 0
  const totalFinal = total + COSTO_ENVIO

  const handlePago = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (metodoPago === 'tarjeta') {
        // Integración con Wompi
        const tokenRes = await fetch(`${BASE_URL}/wompi/token`, {
          method: 'POST'
        })
        
        if (!tokenRes.ok) throw new Error('Error de conexión con procesador de pagos (Token)')
        const tokenData = await tokenRes.json()
        const token = tokenData.access_token

        const formData = {
          tarjeta: numeroTarjeta,
          nombre: nombreTarjeta,
          vencimiento: fechaExpiracion,
          cvv: cvv,
          monto: totalFinal
        }

        const payRes = await fetch(`${BASE_URL}/wompi/paymentTest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, formData })
        })

        if (!payRes.ok) throw new Error('Pago declinado por el procesador')
      } else if (metodoPago === 'paypal') {
        // Simulación de PayPal (ya que no hay backend)
        await new Promise(resolve => setTimeout(resolve, 1500))
        // Aquí normalmente habría un window.location.href hacia PayPal
      }

      // Éxito: Limpiamos carrito y vamos a historial
      clearCart()
      navigate('/historial')
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link to="/home" className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-semibold">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Pago</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario de pago y envío */}
          <div className="flex-1 space-y-8">
            
            {/* Sección Método de Pago */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Método de pago</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <label className={`flex items-center gap-2 border px-4 py-2 rounded-lg cursor-pointer transition-colors ${metodoPago === 'efectivo' ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`}>
                  <input type="radio" name="metodoPago" value="efectivo" checked={metodoPago === 'efectivo'} onChange={(e) => setMetodoPago(e.target.value)} className="text-pink-500 focus:ring-pink-500" />
                  <span className="text-sm font-medium">Pago en efectivo</span>
                </label>
                <label className={`flex items-center gap-2 border px-4 py-2 rounded-lg cursor-pointer transition-colors ${metodoPago === 'transaccion' ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`}>
                  <input type="radio" name="metodoPago" value="transaccion" checked={metodoPago === 'transaccion'} onChange={(e) => setMetodoPago(e.target.value)} className="text-pink-500 focus:ring-pink-500" />
                  <span className="text-sm font-medium">Pago en Transacción</span>
                </label>
                <label className={`flex items-center gap-2 border px-4 py-2 rounded-lg cursor-pointer transition-colors ${metodoPago === 'paypal' ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`}>
                  <input type="radio" name="metodoPago" value="paypal" checked={metodoPago === 'paypal'} onChange={(e) => setMetodoPago(e.target.value)} className="text-pink-500 focus:ring-pink-500" />
                  <span className="text-sm font-medium">PayPal</span>
                </label>
              </div>

              {/* Contenedor de Tarjeta */}
              <div className={`border rounded-lg p-5 transition-all ${metodoPago === 'tarjeta' ? 'border-pink-300 bg-pink-50/30' : 'border-gray-200 opacity-70 grayscale'}`}>
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input type="radio" name="metodoPago" value="tarjeta" checked={metodoPago === 'tarjeta'} onChange={(e) => setMetodoPago(e.target.value)} className="text-pink-500 focus:ring-pink-500" />
                  <span className="font-semibold text-gray-800">Tarjeta de crédito o débito</span>
                </label>

                {metodoPago === 'tarjeta' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Número de tarjeta</label>
                      <div className="relative">
                        <input type="text" placeholder="1234 5678 9012 3456" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400" />
                        <span className="absolute right-3 top-2.5 text-gray-400"></span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre en la tarjeta</label>
                        <input type="text" placeholder="John Doe" value={nombreTarjeta} onChange={(e) => setNombreTarjeta(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de expiración</label>
                          <input type="text" placeholder="05/27" value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-center focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                          <input type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-center focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
                        <input type="checkbox" className="text-pink-500 rounded focus:ring-pink-500" />
                        Guardar tarjeta para futuras compras
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Sección Dirección de Envío */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dirección de envío</h2>
              
              <div className="space-y-3">
                <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${direccionEnvio === 'misma' ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`} onClick={() => setDireccionEnvio('misma')}>
                  <div className="flex items-start justify-between">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="radio" name="direccionEnvio" value="misma" checked={direccionEnvio === 'misma'} onChange={() => {}} className="mt-1 text-pink-500 focus:ring-pink-500" />
                      <div>
                        <span className="block font-semibold text-gray-800">Usar misma dirección de envío</span>
                        {isEditingAddress ? (
                          <div className="mt-2 flex gap-2">
                            <input 
                              type="text" 
                              value={editedAddress} 
                              onChange={(e) => setEditedAddress(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-pink-400"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingAddress(false);
                              }}
                              className="text-xs bg-pink-500 text-white px-3 py-1 rounded font-semibold"
                            >
                              Guardar
                            </button>
                          </div>
                        ) : (
                          <span className="block text-sm text-gray-500 mt-1">
                           {editedAddress}
                          </span>
                        )}
                      </div>
                    </label>
                    {!isEditingAddress && (
                      <button 
                        className="text-xs text-pink-500 font-semibold hover:underline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingAddress(true);
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>

                <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${direccionEnvio === 'diferente' ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`} onClick={() => setDireccionEnvio('diferente')}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="direccionEnvio" value="diferente" checked={direccionEnvio === 'diferente'} onChange={() => {}} className="text-pink-500 focus:ring-pink-500" />
                    <span className="font-semibold text-gray-800">Usar una dirección diferente</span>
                  </label>
                  {direccionEnvio === 'diferente' && (
                    <div className="mt-4 animate-fade-in">
                      <input type="text" placeholder="Ingresa la nueva dirección..." className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400" />
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            <div>
              <Link to="/carrito" className="text-sm text-gray-400 hover:text-gray-600 font-medium inline-flex items-center gap-1">
                <span>←</span> Volver al carrito
              </Link>
            </div>
          </div>

          {/* Resumen del pedido (Sidebar) */}
          <div className="lg:w-96">
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu pedido</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-2">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                      {item.imagenPresentacion ? (
                        <img src={item.imagenPresentacion} alt={item.nombre} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xl"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.nombre}</p>
                    </div>
                    <div className="font-bold text-gray-900 shrink-0">
                      ${Number(item.precio).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Costo de envío</span>
                  <span className="text-gray-900">${COSTO_ENVIO.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalFinal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <button 
                onClick={handlePago}
                disabled={loading}
                className="w-full bg-[#0a192f] hover:bg-[#112240] text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : `Pagar ahora $${totalFinal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Pago
