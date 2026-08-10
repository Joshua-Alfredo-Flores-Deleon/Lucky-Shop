// Navbar.jsx — barra de navegación pública de Lucky Shop
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import logoLucky from '../assets/LogoNegro-removebg-preview.png'

const CATEGORIAS = [
  { label: 'Inicio',              path: '/home' },
  { label: 'Anillos',             path: '/categoria/anillos' },
  { label: 'Pulseras',            path: '/categoria/pulseras' },
  { label: 'Aritos',          path: '/categoria/aritos' },
  { label: 'Collares',            path: '/categoria/collares' },
  { label: 'Bolsas de la suerte', path: '/bolsas-suerte' },
  { label: 'Acerca de',           path: '/acercaDe' },
  { label: 'Otros',               path: '/categoria/otros' },
]

/* Iconos SVG inline */
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
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
    <header className="bg-[#fbdce6] shadow-[0_1px_3px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0" id="nav-logo">
            <img
              src={logoLucky}
              alt="Lucky Shop"
              className="h-10 sm:h-12 w-auto object-contain"
            />
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
                className="w-full pl-10 pr-4 py-2 rounded-full border border-white/60 bg-white/90 text-sm outline-none focus:border-pink-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)] transition-all duration-200"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favoritos (siempre visible) */}
            <Link
              to="/Favoritos"
              className="p-2 rounded-full text-gray-600 hover:text-pink-500 hover:bg-white/50 transition-all duration-200"
              id="nav-favorites"
              title="Favoritos"
            >
              <HeartIcon />
            </Link>

            {/* Carrito (siempre visible) */}
            <Link
              to="/carrito"
              className="relative p-2 rounded-full text-gray-600 hover:text-pink-500 hover:bg-white/50 transition-all duration-200"
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
            {cliente ? (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to="/perfil"
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-pink-500 font-medium transition-colors"
                  id="nav-profile"
                >
                  <UserIcon />
                  <span className="hidden md:inline">{cliente.name || cliente.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
                  id="nav-logout"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full text-gray-600 hover:text-pink-500 hover:bg-white/50 transition-all duration-200"
                id="nav-user-icon"
                title="Iniciar sesión"
              >
                <UserIcon />
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-full text-gray-600 hover:bg-white/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="nav-mobile-toggle"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Nav links (desktop) */}
        <nav className="border-t border-white/50 hidden sm:block" id="nav-categories">
          <ul className="flex items-center justify-center gap-0.5 py-1 overflow-x-auto scrollbar-none">
            {CATEGORIAS.map((c) => (
              <li key={c.path} className="flex-shrink-0">
                <Link
                  to={c.path}
                  className={`nav-link-fancy px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap block rounded-md ${
                    isActive(c.path)
                      ? 'text-pink-600 bg-white/60'
                      : 'text-gray-700 hover:text-pink-500 hover:bg-white/40'
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/50 bg-[#fbdce6] animate-[slideDown_0.2s_ease]">
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
                className="w-full pl-10 pr-4 py-2 rounded-full border border-white/60 bg-white/90 text-sm outline-none focus:border-pink-400 focus:bg-white transition-all"
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
                      ? 'text-pink-600 bg-white/60'
                      : 'text-gray-700 hover:text-pink-500 hover:bg-white/40'
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
                className="flex-1 text-center text-sm text-gray-700 border border-white/70 px-4 py-2 rounded-full font-medium hover:border-pink-400 transition-colors"
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

export default Navbar;