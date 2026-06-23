// Login.jsx — login de clientes Lucky Shop
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Login = () => {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/loginClientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')

      // Guardar datos del cliente
      sessionStorage.setItem('luckyshop_cliente', email.split('@')[0])
      // Si el backend devuelve el id del cliente, guardarlo
      if (data.cliente?._id) sessionStorage.setItem('luckyshop_cliente_id', data.cliente._id)

      navigate('/inicio')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="text-sm text-gray-400 mt-1">Accede a tu cuenta Lucky Shop</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm ring-1 ring-pink-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-pink-500 font-semibold hover:underline">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login
