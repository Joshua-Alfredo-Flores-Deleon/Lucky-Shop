// AuthContext.jsx — estado de sesión del cliente (Lucky Shop)
// Se apoya en la cookie httpOnly "authCookie" que ya emite el backend
// en /api/loginClientes, y en el endpoint /api/loginClientes/checkSession
// para saber si hay una sesión activa al cargar la app o al refrescar.
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const BASE_URL = 'http://localhost:4000/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null) // { email, name } | null
  const [loading, setLoading] = useState(true) // true mientras se valida la sesión inicial

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/loginClientes/checkSession`, {
        credentials: 'include',
      })
      if (!res.ok) {
        setCliente(null)
        return null
      }
      const data = await res.json()
      setCliente(data.cliente || null)
      return data.cliente || null
    } catch {
      setCliente(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Al montar la app, preguntamos al backend si la cookie sigue siendo válida.
  useEffect(() => {
    checkSession()
  }, [checkSession])

  // Se llama justo después de un login exitoso (la cookie ya fue seteada por el backend).
  // Volvemos a consultar checkSession para obtener los datos reales del cliente.
  const login = useCallback(async () => {
    return checkSession()
  }, [checkSession])

  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Aunque falle la petición, limpiamos el estado local igualmente
    } finally {
      setCliente(null)
    }
  }, [])

  const value = {
    cliente,
    isAuthenticated: !!cliente,
    loading,
    login,
    logout,
    checkSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  return ctx
}
