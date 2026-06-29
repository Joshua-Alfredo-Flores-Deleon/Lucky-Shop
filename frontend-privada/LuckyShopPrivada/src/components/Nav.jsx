import { Link, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:4000/api'

const Nav = () => {
  const navigate = useNavigate()
  const user = localStorage.getItem('luckyshop_user') || sessionStorage.getItem('luckyshop_user') || ''

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // necesario para que el backend pueda limpiar authCookie
      })
    } catch {
      // si el backend no responde, igual limpiamos el lado del cliente
    }

    localStorage.removeItem('luckyshop_token')
    localStorage.removeItem('luckyshop_user')
    sessionStorage.removeItem('luckyshop_token')
    sessionStorage.removeItem('luckyshop_user')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-pink-100">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-xl font-bold text-pink-500 tracking-tight">Lucky Shop</span>
          <span className="text-xs text-pink-300 font-medium">Admin</span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-6">
          <li>
            <Link to="/home" className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/productos" className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">
              Productos
            </Link>
          </li>
        </ul>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-500 hidden sm:block">Hola, <strong>{user}</strong></span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full border border-pink-200 px-4 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
