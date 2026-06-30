import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import ProtectedRoute from '../../../frontend-privada/LuckyShopPrivada/src/components/ProtectedRoute.jsx'

// Admin
import Login from '../../../frontend-privada/LuckyShopPrivada/src/pages/Login.jsx'
import Home from '../../../frontend-privada/LuckyShopPrivada/src/pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import RecoveryPasswordAdmin from '../../../frontend-privada/LuckyShopPrivada/src/pages/RecoveryPasswordAdmin.jsx'

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

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ── Admin ── */}
          <Route path="/"          element={<Login />} />
          <Route path="/recovery-password" element={<RecoveryPasswordAdmin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute userType="admin">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute userType="admin">
                <Productos />
              </ProtectedRoute>
            }
          />

          {/* ── Cliente público ── */}
          <Route path="/inicio"            element={<HomeCliente />} />
          <Route path="/login"             element={<LoginCliente />} />
          <Route path="/recovery-password-cliente" element={<RecoveryPasswordCliente />} />
          <Route path="/categoria/:cat"    element={<Categoria />} />
          <Route path="/producto/:id"      element={<ProductoDetalle />} />
          <Route path="/carrito"           element={<Carrito />} />
          <Route path="/historial"         element={<Historial />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/bolsas-suerte"     element={<BolsasSuerte />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App