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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>

            {/* ── Rutas públicas: catálogo navegable sin sesión ── */}
            <Route path="/"                            element={<Navigate to="/home" replace />} />
            <Route path="/login"                      element={<LoginCliente />} />
            <Route path="/register"                    element={<Register />} />
            <Route path="/recuperar-password"           element={<RecuperarPassword />} />
            <Route path="/home"                element={<HomeCliente />} />
            <Route path="/buscar"          element={<Buscar />} />
            <Route path="/categoria/:cat"  element={<Categoria />} />
            <Route path="/producto/:id"    element={<ProductoDetalle />} />
            <Route path="/anillos"         element={<Navigate to="/categoria/anillos" replace />} />
            <Route path="/bolsas-suerte"   element={<BolsasSuerte />} />
            <Route path="/acercaDe"       element={<AcercaDe />} />
            <Route path="/contactanos"       element={<Contactanos />} />
            <Route path="/politicas"         element={<Politicas />} />

            {/* ── Requieren sesión: comprar / ver historial ── */}
            <Route element={<PrivateRoute />}>
              <Route path="/carrito"         element={<Carrito />} />
              <Route path="/pago"            element={<Pago />} />
              <Route path="/historial"       element={<Historial />} />
              <Route path="/perfil"          element={<Perfil />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;