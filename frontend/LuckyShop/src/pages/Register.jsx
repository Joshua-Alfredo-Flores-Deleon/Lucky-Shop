// Register.jsx — registro de clientes con verificación por código
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'http://localhost:4000/api'

const Register = () => {
  const navigate = useNavigate()
  const [step,      setStep]      = useState(1) // 1=datos, 2=verificar código
  const [form,      setForm]      = useState({ name: '', lastName: '', birthdate: '', email: '', password: '' })
  const [codigo,    setCodigo]    = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/registerClientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, isVerified: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al registrarse')
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
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

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="text-sm text-gray-400 mt-1">Únete a Lucky Shop</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm ring-1 ring-pink-100 p-8">

            {success ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-3"></p>
                <p className="font-semibold text-gray-900">¡Cuenta creada!</p>
                <p className="text-sm text-gray-400 mt-1">Redirigiendo al login...</p>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="María" required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="García" required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors" />
                </div>

                {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

                <button type="submit" disabled={loading}
                  className="w-full rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-60">
                  {loading ? 'Enviando...' : 'Crear cuenta'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-pink-500 font-semibold hover:underline">Inicia sesión</Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-3xl mb-2"></p>
                  <p className="font-semibold text-gray-900">Verifica tu correo</p>
                  <p className="text-sm text-gray-400 mt-1">Ingresa el código que enviamos a <strong>{form.email}</strong></p>
                </div>
                <div>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Código de verificación"
                    required
                    maxLength={6}
                    className="w-full text-center tracking-widest rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-bold outline-none focus:border-pink-400 focus:bg-white transition-colors"
                  />
                </div>

                {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

                <button type="submit" disabled={loading}
                  className="w-full rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:opacity-60">
                  {loading ? 'Verificando...' : 'Verificar código'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-gray-600">
                  ← Volver
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register
