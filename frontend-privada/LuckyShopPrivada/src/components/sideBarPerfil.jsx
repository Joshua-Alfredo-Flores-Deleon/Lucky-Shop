import { Link, useNavigate } from 'react-router-dom'
import './sideBarPerfil.css'

const BASE_URL = 'http://localhost:4000/api'

// Sidebar simplificado, solo para la pantalla de Perfil: sin el menú completo de secciones, únicamente "Inicio" (regresa al panel con todo el menú) y "Cerrar sesión".
const SideBarPerfil = () => {
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    try {
      await fetch(`${BASE_URL}/logout`, { method: 'POST', credentials: 'include' })
    } catch {
      // aunque falle la petición, igual limpiamos la sesión local y navegamos al login
    } finally {
      localStorage.removeItem('luckyshop_token')
      localStorage.removeItem('luckyshop_user')
      sessionStorage.removeItem('luckyshop_token')
      sessionStorage.removeItem('luckyshop_user')
      navigate('/', { replace: true })
    }
  }

  return (
    <nav className="luckyshop-nav-container">
      <aside className="sidebar-perfil">
        <div className="sidebar-perfil-espacio" />

        <div className="sidebar-perfil-footer">
          <div className="sidebar-perfil-divider"></div>
          <Link to="/home" className="sidebar-perfil-link">
            <IconoCasa />
            <span>Inicio</span>
          </Link>
          <button onClick={cerrarSesion} className="sidebar-perfil-link sidebar-perfil-boton">
            <IconoSalir />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </nav>
  )
}

function IconoCasa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

function IconoSalir() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export default SideBarPerfil