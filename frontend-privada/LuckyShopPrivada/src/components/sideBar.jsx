import { Link, useLocation } from 'react-router-dom'
import '../productos.css'

// Importación de imágenes y recursos
import logosite from '../assets/image-removebg-preview.png' 
import HomeIcon from '../assets/icons8-casa-24.png'
import ventaIcon from '../assets/ventas.png'
import productoIcon from '../assets/icons8-paquete-50.png'
import clienteIcon from '../assets/icons8-grupo-de-usuario-2-32.png'
import pagosIcon from '../assets/icons8-reembolso-2-50.png'
import bolsasIcon from '../assets/suerte.png'
import videosIcon from '../assets/icons8-vídeo-50.png'
import FinanzasIcon from '../assets/finanza.png'
import notificacionIcon from '../assets/icons8-recordatorios-de-citas-48.png'
import PerfilIcon from '../assets/cuales-son-las-razas-de-gatos-mas-populares-en-colombia.jpg'

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
          <li className={`menu-item ${isActive('/clientes')}`}>
            <Link to="/clientes" className="menu-link">
              <div className="icon-wrapper">
                <img src={clienteIcon} alt="Clientes" />
              </div>
              <span className="menu-text">Clientes</span>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/pagos')}`}>
            <Link to="/pagos" className="menu-link">
              <div className="icon-wrapper">
                <img src={pagosIcon} alt="Pagos" />
              </div>
              <span className="menu-text">Pagos</span>
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
      {/* Barra de Usuario y Notificaciones (Top-Right) */}
      <div className="header-actions">
        {/* Botón de Notificaciones con Indicador de Alerta */}
        <Link to="/notificacion" className="notification-btn" aria-label="Notificaciones">
          <img src={notificacionIcon} alt="Notificaciones" />
          <span className="notification-badge"></span> {/* Pulsing Badge */}
        </Link>
        {/* Perfil del Usuario */}
        <Link to="/perfil" className="profile-btn" aria-label="Ver Perfil">
          <div className="profile-avatar-wrapper">
            <img src={PerfilIcon} alt="Foto de perfil" className="profile-avatar-img" />
          </div>
        </Link>
      </div>
    </nav>
  )
}
export default SideBar
