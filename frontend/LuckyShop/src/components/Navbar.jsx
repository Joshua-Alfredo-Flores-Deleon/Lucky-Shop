// Navbar.jsx — barra de navegación pública de Lucky Shop
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIAS = [
  { label: 'Inicio',          path: '/Home' },
  { label: 'Anillos',         path: '/categoria/anillos' },
  { label: 'Pulseras',        path: '/categoria/pulseras' },
  { label: 'Pendientes',      path: '/categoria/pendientes' },
  { label: 'Collares',        path: '/categoria/collares' },
  { label: 'Bolsas de la suerte', path: '/bolsas-suerte' },
  { label: 'Acerca de',       path: '/AcercaDe' },
  { label: 'Otros',           path: '/categoria/otros' },
]

const Navbar = () => {
  const { totalItems } = useCart()
  const { cliente, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-pink-500 tracking-tight">Luckysh<span className="text-green-500">o</span>p</span>
            <span className="block text-[10px] text-gray-400 text-center -mt-1">by lucky</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
              <input
                type="text"
                placeholder="Buscar"
                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {cliente ? (
              <>
                {/* Favoritos */}
                <button className="text-gray-500 hover:text-pink-500 transition-colors text-xl">♡</button>

                {/* Carrito */}
                <Link to="/carrito" className="relative text-gray-500 hover:text-pink-500 transition-colors text-xl">
                  🛒
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Usuario */}
                <div className="flex items-center gap-2">
                  <Link to="/historial" className="text-sm text-gray-600 hover:text-pink-500 font-medium">{cliente.name || cliente.email}</Link>
                  <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500">Salir</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-pink-500 font-medium whitespace-nowrap">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="text-sm bg-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-600 transition-colors whitespace-nowrap">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="border-t border-gray-100">
          <ul className="flex items-center gap-1 py-1 overflow-x-auto scrollbar-none">
            {CATEGORIAS.map((c) => (
              <li key={c.path} className="flex-shrink-0">
                <Link
                  to={c.path}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-pink-500 font-medium transition-colors whitespace-nowrap block"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar