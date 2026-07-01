// Productos.jsx — CRUD completo de productos de Lucky Shop
// Fetch directo en la página, sin services, mismo patrón del proyecto de referencia
import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import logoNegro from '../assets/LogoNegro.png'
import '../acercaDe.css'

const AcercaDe = () => {



  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

        <div className='contenedor1'>
            <h1 className='titulo'>¿Quiénes somos?</h1>
            <img src={logoNegro} alt="Logo de lucky SHop en color negro" className='logo' />
        </div>
      
      <Footer />
    </div>
  ) 
}

export default AcercaDe
