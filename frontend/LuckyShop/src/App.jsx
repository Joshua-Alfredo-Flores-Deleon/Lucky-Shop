import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

// Cliente
import HomeCliente from './pages/HomeCliente.jsx'
import Buscar from './pages/Buscar.jsx'
import Categoria from './pages/Categoria.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Historial from './pages/Historial.jsx'
import Register from './pages/Register.jsx'
import BolsasSuerte from './pages/BolsasSuerte.jsx'
import LoginCliente from './pages/LoginCliente.jsx'
import RecuperarPassword from './pages/RecuperarPassword.jsx'
import AcercaDe from './pages/AcercaDe.jsx'
import Perfil from './pages/Perfil.jsx'
import Contactanos from './pages/contactanos.jsx'
import Politicas from './pages/Politicas.jsx'
import Pago from './pages/Pago.jsx'
import Favoritos from './pages/Favoritos.jsx'
import Promociones from './pages/Promociones.jsx'
import GuiaRegalo from './pages/GuiaRegalo.jsx'
import Videos from './pages/Videos.jsx'
import NotFound from './pages/404.jsx'
import BolsaDetalle from './pages/BolsaDetalle.jsx'

// App.jsx — punto de entrada del sitio público de Lucky Shop.
// Define todas las rutas: las públicas (catálogo, login, etc.) y las privadas
// (carrito, pago, perfil, etc.), protegidas por PrivateRoute.
function App() {
  return (
    // AuthProvider da acceso a la sesión del cliente en toda la app
    <AuthProvider>
      {/* CartProvider da acceso al carrito de compras en toda la app */}
      <CartProvider>
        <Router>
          <Routes>

            {/*Rutas públicas: catálogo navegable sin sesión */}
            <Route path="/"                 element={<Navigate to="/home" replace />} />
            <Route path="/login"            element={<LoginCliente />} />
            <Route path="/register"         element={<Register />} />
            <Route path="/recuperar-password"  element={<RecuperarPassword />} />
            <Route path="/home"                element={<HomeCliente />} />
            <Route path="/buscar"          element={<Buscar />} />
            <Route path="/categoria/:cat"  element={<Categoria />} />
            <Route path="/producto/:id"    element={<ProductoDetalle />} />
            <Route path="/anillos"         element={<Navigate to="/categoria/anillos" replace />} />
            <Route path="/bolsas-suerte"   element={<BolsasSuerte />} />
            <Route path="/bolsa/:id"       element={<BolsaDetalle />} />
            <Route path="/acercaDe"        element={<AcercaDe />} />
            <Route path="/contactanos"     element={<Contactanos />} />
            <Route path="/politicas"       element={<Politicas />} />
            <Route path="/guia-regalo"     element={<GuiaRegalo />} />
            <Route path="/promociones"     element={<Promociones />} />

            {/* Requieren sesión — envueltas en PrivateRoute, que redirige a /login si no hay sesión */}
            <Route element={<PrivateRoute />}>
              <Route path="/carrito"         element={<Carrito />} />
              <Route path="/pago"            element={<Pago />} />
              <Route path="/historial"       element={<Historial />} />
              <Route path="/perfil"          element={<Perfil />} />
              <Route path="/favoritos"       element={<Favoritos />} />
              <Route path="/Favoritos"       element={<Favoritos />} />
              <Route path="/videos"          element={<Videos />} />
              
            </Route>
             <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;