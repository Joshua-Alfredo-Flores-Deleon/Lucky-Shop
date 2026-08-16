// AdminAuthContext.jsx — estado de sesión del administrador (Lucky Shop Admin)
// Valida la sesión UNA sola vez al cargar la app, y la comparte a través de
// Context para que las rutas protegidas no vuelvan a llamar al backend
// cada vez que se navega entre páginas.
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const BASE_URL = 'http://localhost:4000/api'

const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false)
  const [loading, setLoading] = useState(true) // true mientras se valida la sesión inicial

  // Consulta al backend si la cookie de sesión del admin sigue siendo válida
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/loginAdmin/checkSession`, {
        method: 'GET',
        credentials: 'include',
      })
      setAutenticado(res.ok)
      return res.ok
    } catch {
      setAutenticado(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Se valida solo UNA vez, al montar la app completa
  useEffect(() => {
    checkSession()
  }, [checkSession])

  const value = { autenticado, loading, checkSession }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de un <AdminAuthProvider>')
  return ctx
}