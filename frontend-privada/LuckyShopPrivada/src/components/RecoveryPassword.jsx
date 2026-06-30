// RecoveryPassword.jsx — flujo compartido de recuperación de contraseña
// Se usa tanto para Admin como para Cliente, parametrizado por "userType".
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:4000/api'

// userType: 'admin' | 'cliente'
const RecoveryPassword = ({ userType }) => {
  const navigate = useNavigate()

  const isAdmin = userType === 'admin'
  const apiBase = isAdmin ? `${BASE_URL}/recoveryPasswordAdmin` : `${BASE_URL}/recoveryPassword`
  const backToLoginPath = isAdmin ? '/' : '/login'

  // step: 'email' | 'code' | 'newPassword' | 'success'
  const [step, setStep] = useState('email')

  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', ''])
  const inputsRef = useRef([])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const maskedEmail = email.length
    ? email.replace(/^(.).*(@.*)$/, (_, first, domain) => first + '*'.repeat(10) + domain)
    : ''

  // ── Paso 1: solicitar código ──
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Por favor introduce tu correo electrónico.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/requestCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message === 'user not found'
        ? 'No encontramos una cuenta con ese correo.'
        : (data.message || 'No se pudo enviar el código.'))

      setStep('code')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Paso 2: verificar PIN ──
  const handleCodeChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')

    const fullCode = code.join('')
    if (fullCode.length < code.length) {
      setError('Introduce el PIN completo.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/verifyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: fullCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message === 'Invalid code'
        ? 'El código ingresado no es válido.'
        : (data.message || 'No se pudo verificar el código.'))

      setStep('newPassword')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/requestCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'No se pudo reenviar el código.')
      setCode(['', '', '', '', ''])
      inputsRef.current[0]?.focus()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Paso 3: nueva contraseña ──
  const handleNewPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/newPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword, confirmNewPassword: confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'No se pudo actualizar la contraseña.')

      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-pink-500">Lucky</span>
            <span className="text-green-500">shop</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 tracking-wide">BY LESLY</p>
          <div className="w-full h-px bg-gray-200 mt-4" />
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-pink-100 p-8 ring-1 ring-pink-100">

          {/* ── Paso 1: pedir correo ── */}
          {step === 'email' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Recuperación de contraseña</h2>
              <div className="w-12 h-1 bg-pink-300 rounded-full mb-4" />
              <p className="text-sm text-gray-500 mb-6">
                Introduce tú correo electrónico. Te enviaremos un código PIN
                de verificación para que puedas restablecer tú contraseña de
                forma segura en el siguiente paso.
              </p>

              <form onSubmit={handleRequestCode} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@luckyshop.com"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-pink-300 py-3 text-sm font-semibold text-gray-700 hover:bg-pink-400 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Enviando...' : 'Enviar código'}
                </button>
              </form>
            </>
          )}

          {/* ── Paso 2: código de verificación ── */}
          {step === 'code' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Código de verificación</h2>
              <div className="w-16 h-1 bg-pink-300 rounded-full mb-4 mx-auto" />
              <p className="text-sm text-gray-500 mb-6 text-center">
                Código de seguridad enviado a la dirección<br />
                <span className="font-medium text-gray-700">{maskedEmail}</span>
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3 text-center">Coloca el PIN de seguridad para continuar</p>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        className="w-12 h-12 text-center text-lg font-semibold rounded-xl border border-gray-200 bg-gray-100 outline-none focus:border-pink-400 focus:bg-white transition-colors"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-pink-400 py-3 text-sm font-semibold text-white hover:bg-pink-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Verificando...' : 'Confirmar'}
                </button>

                <p className="text-center text-xs text-gray-500">
                  ¿No recibiste código?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-pink-500 font-semibold hover:underline"
                  >
                    Reenviar Pin
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── Paso 3: nueva contraseña ── */}
          {step === 'newPassword' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Reestablecer contraseña</h2>
              <div className="w-12 h-1 bg-pink-300 rounded-full mb-4" />
              <p className="text-sm text-gray-500 mb-6">
                Crea una nueva contraseña que sea fácil de recordar
                pero difícil de adivinar. Te recomendamos usar una
                combinación de letras y números.
              </p>

              <form onSubmit={handleNewPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1">*Mínimo 8 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-pink-300 py-3 text-sm font-semibold text-gray-700 hover:bg-pink-400 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>
            </>
          )}

          {/* ── Paso 4: éxito ── */}
          {step === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-200">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Éxito!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Tú contraseña ha sido actualizada<br />
                con éxito,<br />
                ya puedes disfrutar de luckyshop!
              </p>
              <button
                onClick={() => navigate(backToLoginPath)}
                className="w-full rounded-2xl bg-pink-300 py-3 text-sm font-semibold text-gray-700 hover:bg-pink-400 hover:text-white transition-colors"
              >
                Continuar
              </button>
            </div>
          )}
        </div>

        {step !== 'success' && (
          <div className="mt-4">
            <Link to={backToLoginPath} className="text-sm text-gray-500 hover:text-pink-500 hover:underline">
              ‹ Regresar a inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecoveryPassword
