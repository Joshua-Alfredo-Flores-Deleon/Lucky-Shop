import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AdminLogo from '../components/AdminLogo.jsx'

const BASE_URL = 'http://localhost:4000/api'
const CLOVER_BG = 'https://images.unsplash.com/photo-1748357663177-f93b0d158eda?fm=jpg&q=80&w=1200&auto=format&fit=crop'

const Login = () => {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('luckyshop_token') || sessionStorage.getItem('luckyshop_token')
    if (token) navigate('/home')
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Por favor completa email y contraseña.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/loginAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // necesario para que el backend pueda setear la cookie authCookie
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Email o contraseña incorrectos.')
      }

      // El backend ya dejó la sesión en una cookie httpOnly (authCookie).
      // Aquí solo guardamos un indicador local para que la UI sepa que hay sesión activa.
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('luckyshop_token', 'session-active')
      storage.setItem('luckyshop_user', email.trim())

      navigate('/home')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Panel izquierdo — imagen + frase */}
      <div
        className="relative w-full md:w-1/2 min-h-[260px] md:min-h-screen bg-cover bg-center flex items-end p-8 md:p-12"
        style={{ backgroundImage: `url(${CLOVER_BG})` }}
      >
        <div className="bg-black/35 rounded-2xl px-6 py-5 max-w-sm">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
            La suerte<br />de la<br />elegancia
          </h2>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-8">
            Bienvenido de nuevo
          </h2>

          <div className="border border-gray-200 rounded-2xl shadow-sm px-7 py-8">
            <AdminLogo size="md" className="mb-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@luckyshop.com"
                  required
                  className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white transition-colors"
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
                  className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Recordarme la contraseña
                </label>
                <Link to="/recovery-password" className="text-green-700 font-medium hover:underline whitespace-nowrap">
                  ¿Olvidaste la contraseña?
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-green-800 py-3 text-sm font-semibold text-white hover:bg-green-900 transition-colors disabled:cursor-not-allowed disabled:opacity-60 mt-2"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
