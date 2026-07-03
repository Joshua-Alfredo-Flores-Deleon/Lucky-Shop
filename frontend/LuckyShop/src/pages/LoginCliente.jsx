// Login.jsx — login de clientes Lucky Shop
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BASE_URL = 'http://localhost:4000/api'
const JOYAS_BG = 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?fm=jpg&q=80&w=1200&auto=format&fit=crop'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })

  // Si veníamos redirigidos desde una ruta privada, regresamos ahí; si no, al inicio.
  const from = location.state?.from?.pathname || '/home'

  const onSubmit = async ({ email, password }) => {
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

      // El backend ya dejó la cookie httpOnly seteada; refrescamos el estado
      // de autenticación (nombre/email del cliente) contra checkSession.
      await login()

      // Redirige a la página principal (o a la ruta que el usuario intentaba visitar)
      // con el usuario ya iniciado.
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Panel izquierdo — foto de joyería sobre fondo rosa */}
      <div
        className="relative w-full md:w-1/2 min-h-[220px] md:min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${JOYAS_BG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/70 via-pink-100/40 to-pink-300/60" />
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold text-gray-900 text-center mb-1">Inicio de sesión</h1>
          <p className="text-sm text-gray-500 text-center border-b border-gray-200 pb-4 mb-8">
            ¡Ingresa tus datos para descubrir tú suerte de hoy!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo eléctronico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                {...register('email', {
                  required: 'El correo es obligatorio.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo válido.',
                  },
                })}
                className={`w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none shadow-sm transition-colors ${
                  errors.email ? 'border-red-300 focus:border-red-400' : 'border-pink-200 focus:border-pink-400'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'La contraseña es obligatoria.',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres.' },
                })}
                className={`w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none shadow-sm transition-colors ${
                  errors.password ? 'border-red-300 focus:border-red-400' : 'border-pink-200 focus:border-pink-400'
                }`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('recordarme')}
                  className="rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                />
                Recordarme la contraseña
              </label>
              <Link to="/recovery-password-cliente" className="text-pink-500 font-medium hover:underline whitespace-nowrap">
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-[220px] rounded-full bg-pink-200 py-3 text-sm font-semibold text-gray-800 hover:bg-pink-300 transition-colors disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-pink-500 font-semibold hover:underline">Regístrate aquí</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
