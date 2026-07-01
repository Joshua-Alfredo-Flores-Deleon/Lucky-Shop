import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

// Cliente
import HomeCliente from './pages/HomeCliente.jsx'
import Categoria from './pages/Categoria.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Historial from './pages/Historial.jsx'
import Register from './pages/Register.jsx'
import BolsasSuerte from './pages/BolsasSuerte.jsx'
import LoginCliente from './pages/LoginCliente.jsx'
import RecuperarPassword from './pages/RecuperarPassword.jsx'
import RecoveryPasswordCliente from './pages/RecoveryPasswordCliente.jsx'
import Anillos from './pages/Anillos.jsx'
import AcercaDe from './pages/AcercaDe.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>

            {/* ── Rutas públicas: catálogo navegable sin sesión ── */}
            <Route path="/login"                      element={<LoginCliente />} />
            <Route path="/register"                    element={<Register />} />
            <Route path="/recuperar-password"           element={<RecuperarPassword />} />
            <Route path="/recovery-password-cliente"    element={<RecoveryPasswordCliente />} />
            <Route path="/"                element={<HomeCliente />} />
            <Route path="/categoria/:cat"  element={<Categoria />} />
            <Route path="/producto/:id"    element={<ProductoDetalle />} />
            <Route path="/anillos"         element={<Anillos />} />
            <Route path="/bolsas-suerte"   element={<BolsasSuerte />} />

            {/* ── Requieren sesión: comprar / ver historial ── */}
            <Route element={<PrivateRoute />}>
              <Route path="/carrito"         element={<Carrito />} />
              <Route path="/historial"       element={<Historial />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;