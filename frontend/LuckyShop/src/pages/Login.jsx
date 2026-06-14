import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Credenciales del administrador (en producción vendrían del backend)
const ADMIN_USERS = [
  { id: 1, email: 'admin@luckyshop.com', password: 'lucky2026', nombre: 'Admin' },
  { id: 2, email: 'dueña@luckyshop.com', password: 'luckyshop', nombre: 'Dueña' },
]

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
      const user = ADMIN_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      )

      if (!user) throw new Error('Email o contraseña incorrectos.')

      const token   = `luckyshop-token-${user.id}-${Date.now()}`
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('luckyshop_token', token)
      storage.setItem('luckyshop_user', user.nombre)

      navigate('/home')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500 tracking-tight">Lucky Shop</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-pink-100 p-8 ring-1 ring-pink-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@luckyshop.com"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
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
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                />
                Recordar sesión
              </label>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-5 rounded-2xl bg-pink-50 px-4 py-3 text-xs text-pink-600">
            <p className="font-semibold mb-1">Credenciales de prueba:</p>
            <p>admin@luckyshop.com / lucky2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
