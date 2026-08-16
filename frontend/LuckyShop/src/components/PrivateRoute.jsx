// PrivateRoute.jsx — protege rutas del cliente: si no hay sesión activa,
// redirige a /login (guardando a dónde quería ir para regresarlo después).
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PrivateRoute = () => {
  // Estado de sesión: si hay cliente autenticado y si aún se está validando
  const { isAuthenticated, loading } = useAuth()
  // Ruta actual, para poder regresar aquí después de iniciar sesión
  const location = useLocation()

  // Mientras se valida la sesión (por ejemplo, al recargar la página), muestra un loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Sin sesión activa: redirige al login, guardando la ruta de origen
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Con sesión activa: renderiza la ruta hija protegida
  return <Outlet />
}

export default PrivateRoute