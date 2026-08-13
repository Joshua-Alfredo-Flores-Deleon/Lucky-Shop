import { Link, useLocation } from 'react-router-dom'

// Importación de imágenes y recursos
import logosite from '../assets/image-removebg-preview.png' 
import HomeIcon from '../assets/icons8-casa-24.png'
import ventaIcon from '../assets/ventas.png'
import productoIcon from '../assets/icons8-paquete-50.png'
import clienteIcon from '../assets/icons8-grupo-de-usuario-2-32.png'
import bolsasIcon from '../assets/suerte.png'
import videosIcon from '../assets/icons8-vídeo-50.png'
import FinanzasIcon from '../assets/finanza.png'

const SideBar = () => {
  const location = useLocation()

  // Función para determinar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }
  return (
    <nav className="luckyshop-nav-container">
      {/* Sidebar Principal */}
      <aside className="luckyshop-sidebar">
        {/* Contenedor del Logo */}
        <div className="logo-container">
          <Link to="/home" className="logo-link">
            <img className="logo-img" src={logosite} alt="Logo de Lucky Shop" />
          </Link>
        </div>
        {/* Separador Estilizado */}
        <div className="sidebar-divider"></div>
        {/* Lista de Navegación */}
        <ul className="sidebar-menu">
          <li className={`menu-item ${isActive('/home')}`}>
            <Link to="/home" className="menu-link">
              <div className="icon-wrapper">
                <img src={HomeIcon} alt="Inicio" />
              </div>
              <span className="menu-text">Inicio</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/ventas')}`}>
            <Link to="/ventas" className="menu-link">
              <div className="icon-wrapper">
                <img src={ventaIcon} alt="Ventas" />
              </div>
              <span className="menu-text">Ventas</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/productos')}`}>
            <Link to="/productos" className="menu-link">
              <div className="icon-wrapper">
                <img src={productoIcon} alt="Productos" />
              </div>
              <span className="menu-text">Productos</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/promociones')}`}>
            <Link to="/promociones" className="menu-link">
              <div className="icon-wrapper">
                {/* Ícono SVG de etiqueta de descuento (no requiere imagen externa) */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <span className="menu-text">Promociones</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/clientes')}`}>
            <Link to="/clientes" className="menu-link">
              <div className="icon-wrapper">
                <img src={clienteIcon} alt="Clientes" />
              </div>
              <span className="menu-text">Clientes</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/bolsasSuerte')}`}>
            <Link to="/bolsasSuerte" className="menu-link">
              <div className="icon-wrapper">
                <img src={bolsasIcon} alt="Bolsas de la suerte" />
              </div>
              <span className="menu-text">Bolsas de la suerte</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/videosCombos')}`}>
            <Link to="/videosCombos" className="menu-link">
              <div className="icon-wrapper">
                <img src={videosIcon} alt="Videos combos" />
              </div>
              <span className="menu-text">Videos combos</span>
            </Link>
          </li>
          {/* Separador Estilizado */}
          <div className="sidebar-divider"></div>
          <li className={`menu-item ${isActive('/finanzas')}`}>
            <Link to="/finanzas" className="menu-link">
              <div className="icon-wrapper">
                <img src={FinanzasIcon} alt="Finanzas" />
              </div>
              <span className="menu-text">Finanzas</span>
            </Link>
          </li>
        </ul>
      </aside>
    </nav>
  )
}
export default SideBar;