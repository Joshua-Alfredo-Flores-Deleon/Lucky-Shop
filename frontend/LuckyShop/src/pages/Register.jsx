// Register.jsx — registro de clientes con verificación por código
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:4000/api'
const FLATLAY_BG = 'https://images.unsplash.com/photo-1647559709189-a257be60e147?fm=jpg&q=80&w=1400&auto=format&fit=crop'

const Register = () => {
  const navigate = useNavigate()
  const [step,    setStep]    = useState(1) // 1=datos, 2=verificar código
  const [email,   setEmail]   = useState('') // se guarda para mostrarlo en el paso 2
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ── Formulario del paso 1: datos de registro ──
  const {
    register: registerDatos,
    handleSubmit: handleSubmitDatos,
    formState: { errors: erroresDatos },
  } = useForm({ mode: 'onBlur' })

  // ── Formulario del paso 2: código de verificación ──
  const {
    register: registerCodigo,
    handleSubmit: handleSubmitCodigo,
    formState: { errors: erroresCodigo },
  } = useForm({ mode: 'onBlur' })

  const onSubmitDatos = async (datos) => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/registerClientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...datos, isVerified: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al registrarse')
      setEmail(datos.email)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitCodigo = async ({ codigo }) => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/registerClientes/verifyCodeEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ verificationCodeRequest: codigo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Código incorrecto')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition-colors ${
      hasError ? 'border-red-300 focus:border-red-400' : 'border-pink-200 focus:border-pink-400'
    }`

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${FLATLAY_BG})` }}
    >
      <div className="absolute inset-0 bg-pink-100/50" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-serif tracking-tight text-gray-900">Luckyshop</h1>
          <p className="text-gray-400 text-[10px] tracking-[0.25em] font-medium -mt-1">BY LESLY</p>
          <div className="w-full h-px bg-white/70 mt-3" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-pink-200 px-8 py-8">

          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 ring-1 ring-pink-200">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">¡Cuenta creada!</p>
              <p className="text-sm text-gray-400 mt-1">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : step === 1 ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Regístrate</h2>
              <div className="w-full h-px bg-gray-200 mb-5" />

              <form onSubmit={handleSubmitDatos(onSubmitDatos)} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    placeholder="Alberto Fuentes"
                    {...registerDatos('name', {
                      required: 'El nombre es obligatorio.',
                      minLength: { value: 2, message: 'Debe tener al menos 2 caracteres.' },
                    })}
                    className={inputClass(erroresDatos.name)}
                  />
                  {erroresDatos.name && <p className="text-xs text-red-500 mt-1 ml-1">{erroresDatos.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    placeholder="García"
                    {...registerDatos('lastName', {
                      required: 'El apellido es obligatorio.',
                      minLength: { value: 2, message: 'Debe tener al menos 2 caracteres.' },
                    })}
                    className={inputClass(erroresDatos.lastName)}
                  />
                  {erroresDatos.lastName && <p className="text-xs text-red-500 mt-1 ml-1">{erroresDatos.lastName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo eléctronico</label>
                  <input
                    type="email"
                    placeholder="alberto_lj@gmail.com"
                    {...registerDatos('email', {
                      required: 'El correo es obligatorio.',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un correo válido.',
                      },
                    })}
                    className={inputClass(erroresDatos.email)}
                  />
                  {erroresDatos.email && <p className="text-xs text-red-500 mt-1 ml-1">{erroresDatos.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerDatos('password', {
                        required: 'La contraseña es obligatoria.',
                        minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                      })}
                      className={inputClass(erroresDatos.password)}
                    />
                    {erroresDatos.password && <p className="text-xs text-red-500 mt-1 ml-1">{erroresDatos.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                    <input
                      type="date"
                      {...registerDatos('birthdate', {
                        required: 'La fecha es obligatoria.',
                        validate: (value) =>
                          new Date(value) <= new Date() || 'La fecha no puede ser futura.',
                      })}
                      className={inputClass(erroresDatos.birthdate)}
                    />
                    {erroresDatos.birthdate && <p className="text-xs text-red-500 mt-1 ml-1">{erroresDatos.birthdate.message}</p>}
                  </div>
                </div>

                {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

                <div className="pt-2 text-center">
                  <button type="submit" disabled={loading}
                    className="w-full max-w-[220px] rounded-full bg-pink-200 py-3 text-sm font-semibold text-gray-800 hover:bg-pink-300 transition-colors disabled:opacity-60">
                    {loading ? 'Enviando...' : 'Registrarse'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-center">Verifica tu correo</h2>
              <div className="w-full h-px bg-gray-200 mb-5" />
              <form onSubmit={handleSubmitCodigo(onSubmitCodigo)} noValidate className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  Ingresa el código que enviamos a<br /><strong className="text-gray-700">{email}</strong>
                </p>
                <div>
                  <input
                    type="text"
                    placeholder="Código de verificación"
                    maxLength={6}
                    {...registerCodigo('codigo', {
                      required: 'Ingresa el código que recibiste por correo.',
                      minLength: { value: 6, message: 'El código tiene 6 caracteres.' },
                      maxLength: { value: 6, message: 'El código tiene 6 caracteres.' },
                    })}
                    className={`w-full text-center tracking-widest rounded-full border bg-white px-4 py-3 text-lg font-bold outline-none transition-colors ${
                      erroresCodigo.codigo ? 'border-red-300 focus:border-red-400' : 'border-pink-200 focus:border-pink-400'
                    }`}
                  />
                  {erroresCodigo.codigo && <p className="text-xs text-red-500 mt-1 ml-1 text-center">{erroresCodigo.codigo.message}</p>}
                </div>

                {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

                <div className="pt-2 text-center">
                  <button type="submit" disabled={loading}
                    className="w-full max-w-[220px] rounded-full bg-pink-200 py-3 text-sm font-semibold text-gray-800 hover:bg-pink-300 transition-colors disabled:opacity-60">
                    {loading ? 'Verificando...' : 'Verificar código'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="block w-full text-sm text-gray-400 hover:text-gray-600 mt-3">
                    ← Volver
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {!success && (
          <div className="mt-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-pink-500 hover:underline">
              ‹ Regresar a Inicio de Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
