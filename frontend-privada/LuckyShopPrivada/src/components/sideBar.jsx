import { Link } from 'react-router-dom'
import '../productos.css'
// 1. Importas la imagen dándole un nombre (por ejemplo: logosite)
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

const sideBar = () => {
  return (
    <nav className="contenedor">
      <div className="sidebar">
        {/* Logo */}
        <Link to="/home" className="">
          {/* 2. Usas la variable entre llaves en el src */}
          <img className='logo' src={logosite} alt="Logo de Lucky Shop" />
            <hr className='line'/>
        </Link>

        {/* Links */}
        <ul className="">
          <li className='apartado'>
            <img src={HomeIcon} alt="Icono de Inicio" />
            <Link to="/home" className="text">Inicio</Link>
          </li>
          <li className='apartado'>
            <img src={ventaIcon} alt=" Icono de Ventas" />
            <Link to="/ventas" className="text">Ventas</Link>
          </li>
          <li className='apartado'>
            <img src={productoIcon} alt="Icono de productos" />
            <Link to="/productos" className="text">Productos</Link>
          </li>
          <li className='apartado'>
            <img src={clienteIcon} alt="Icono de clientes" />
            <Link to="/clientes" className="text">Clientes</Link>
          </li>
          <li className='apartado'>
            <img src={pagosIcon} alt="Icono de pagos" />
            <Link to="/pagos" className="text">Pagos</Link>
          </li>
          <li className='apartado'>
            <img src={bolsasIcon} alt="Icono de bolsas de la suerte" />
            <Link to="/bolsasSuerte" className="text">Bolsas de la suerte</Link>
          </li>
          <li className='apartado'>
            <img src={videosIcon} alt="Icono de videos combos" />
            <Link to="/videosCombos" className="text">Videos combos</Link>
          </li>

          <hr className='line'/>    

          <li className='apartado'>
            <img src={FinanzasIcon} alt="Icono de finanzas" />
            <Link to="/finanzas" className="text">Finanzas</Link>
          </li>
        </ul>
      </div>





      <div className='contenedor2'>
        {/* Logo */}
        <Link to="/perfil" className="noti">
          {/* 2. Usas la variable entre llaves en el src */}
          <img className='' src={notificacionIcon} alt="    Icon de notificacion" />
        </Link>
        <Link to="/notificacion" className='perfil'>
            <img src={PerfilIcon} alt="Foto del perfil" />
        </Link>
      </div>
    </nav>
  )
}

export default sideBar