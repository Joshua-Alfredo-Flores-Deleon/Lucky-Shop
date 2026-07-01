// Productos.jsx — CRUD completo de productos de Lucky Shop
// Fetch directo en la página, sin services, mismo patrón del proyecto de referencia
import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

import '../acercaDe.css'

const AcercaDe = () => {



  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

        <div>
            <h1>Hola</h1>
        </div>
      
      <Footer />
    </div>
  ) 
}

export default AcercaDe
