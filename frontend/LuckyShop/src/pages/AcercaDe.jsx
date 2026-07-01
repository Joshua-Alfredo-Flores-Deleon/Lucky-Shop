// Productos.jsx — CRUD completo de productos de Lucky Shop
// Fetch directo en la página, sin services, mismo patrón del proyecto de referencia
import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import logoNegro from '../assets/LogoNegro-removebg-preview.png'
import '../acercaDe.css'
import dueña from '../assets/dueña.jpeg'

const AcercaDe = () => {



  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

        <div className='contenedor1'>
            <h1 className='titulo'><b>¿Quiénes somos?</b></h1>
            <img src={logoNegro} alt="Logo de lucky SHop en color negro" className='logo' />
        </div>

        <div className='Definitivo'>
            <div className='contenedor2'>
                <div className='historia'>  
                    <p><b>LuckyShop</b> es el resultado del sueño de una madre apasionada por el significado de los detalles y el poder de los símbolos de buena fortuna. Nuestra marca nace con el deseo de compartir piezas de joyería que no solo adornan, sino que también actúan como amuletos de luz, protección y alegría. Cada joya en Luckyshop es seleccionada con el amor y la dedicación que solo una madre puede poner, buscando que cada persona que use nuestras piezas lleve consigo un pedacito de suerte y confianza en su camino.</p>
                </div>
                <img src={dueña} alt="Dueña de la empresa Lucky Shop" />
            </div>

            <div className='contenedorS'>
                <div className='contenedor3'>
                    <h1 className='titulo2'><b>MISIÓN</b></h1>
                    <p className='texto2'>Llevar alegría y protección a cada cliente a través de joyas con significado, ofreciendo calidad y un servicio cálido que refleje el amor con el que nació este proyecto.</p>
                </div>

                <div className='contenedor3'>
                    <h1 className='titulo2'><b>VISIÓN   </b></h1>
                    <p className='texto2'>Ser la tienda favorita de joyas con significado, reconocida por contagiar positividad y por convertir cada accesorio en un símbolo de buena suerte para nuestra comunidad.</p>
                </div>
            </div>
        </div>
      
      <Footer />
    </div>
  ) 
}

export default AcercaDe
