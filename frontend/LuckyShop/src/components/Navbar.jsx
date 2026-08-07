// Navbar.jsx — barra de navegación pública de Lucky Shop
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIAS = [
  { label: 'Inicio',              path: '/home' },
  { label: 'Anillos',             path: '/categoria/anillos' },
  { label: 'Pulseras',            path: '/categoria/pulseras' },
  { label: 'Pendientes',          path: '/categoria/pendientes' },
  { label: 'Collares',            path: '/categoria/collares' },
  { label: 'Boletos de la suerte', path: '/bolsas-suerte' },
  { label: 'Acerca de',           path: '/acercaDe' },
  { label: 'Otros',               path: '/categoria/otros' },
]

/* ── Iconos SVG inline ── */
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
  </svg>
)

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

const Navbar = () => {
  const { totalItems } = useCart()
  const { cliente, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [busqueda, setBusqueda] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleBuscarSubmit = (e) => {
    e.preventDefault()
    if (!busqueda.trim()) return
    navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`)
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between py-3 gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0 group" id="nav-logo">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 transition-colors">
              Luckysh<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">o</span>p
            </span>
            <span className="block text-[9px] text-gray-400 text-center -mt-0.5 font-medium tracking-widest uppercase">
              by lucky
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleBuscarSubmit} className="flex-1 max-w-md hidden sm:block" id="nav-search">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50/80 text-sm outline-none focus:border-pink-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)] transition-all duration-200"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {cliente ? (
              <>
                {/* Favoritos */}
                <Link
                  to="/favoritos"
                  className="p-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
                  id="nav-favorites"
                  title="Favoritos"
                >
                  <HeartIcon />
                </Link>

                {/* Carrito */}
                <Link
                  to="/carrito"
                  className="relative p-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
                  id="nav-cart"
                  title="Carrito"
                >
                  <CartIcon />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-pink-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Usuario */}
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/perfil"
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-pink-500 font-medium transition-colors"
                    id="nav-profile"
                  >
                    <UserIcon />
                    <span className="hidden md:inline">{cliente.name || cliente.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                    id="nav-logout"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="p-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
                  id="nav-user-icon"
                  title="Iniciar sesión"
                >
                  <UserIcon />
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="nav-mobile-toggle"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Nav links (desktop) ── */}
        <nav className="border-t border-gray-100 hidden sm:block" id="nav-categories">
          <ul className="flex items-center gap-0.5 py-1 overflow-x-auto scrollbar-none">
            {CATEGORIAS.map((c) => (
              <li key={c.path} className="flex-shrink-0">
                <Link
                  to={c.path}
                  className={`nav-link-fancy px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap block rounded-md ${
                    isActive(c.path)
                      ? 'text-pink-600 bg-pink-50/60'
                      : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50/40'
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white animate-[slideDown_0.2s_ease]">
          {/* Mobile search */}
          <form onSubmit={handleBuscarSubmit} className="px-4 pt-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50/80 text-sm outline-none focus:border-pink-400 focus:bg-white transition-all"
              />
            </div>
          </form>
          <ul className="px-2 py-2">
            {CATEGORIAS.map((c) => (
              <li key={c.path}>
                <Link
                  to={c.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(c.path)
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50/40'
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          {!cliente && (
            <div className="px-4 pb-3 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-full font-medium hover:border-pink-400 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar