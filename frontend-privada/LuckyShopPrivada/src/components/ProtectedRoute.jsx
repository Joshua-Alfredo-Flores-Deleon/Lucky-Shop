// ProtectedRoute.jsx — guard de rutas: lee la sesión ya validada del
// AdminAuthContext, sin volver a llamar al backend en cada navegación.
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { autenticado, loading } = useAdminAuth()

  // Vista temporal mientras se confirma el estado de la sesión (solo pasa una vez, al cargar la app)
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Verificando sesión...</p>
      </div>
    )
  }

  // Sin sesión válida: redirige al login
  if (!autenticado) {
    return <Navigate to="/" replace />
  }

  // Con sesión válida: renderiza el contenido protegido
  return children
}

export default ProtectedRoute;