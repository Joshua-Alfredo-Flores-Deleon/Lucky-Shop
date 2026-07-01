import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'

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
    <CartProvider>
      <Router>
        <Routes>

          {/* ── Cliente público ── */}
          <Route path="/"            element={<HomeCliente />} />
          <Route path="/login"             element={<LoginCliente />} />
          <Route path="/recovery-password-cliente" element={<RecoveryPasswordCliente />} />
          <Route path="/categoria/:cat"    element={<Categoria />} />
          <Route path="/producto/:id"      element={<ProductoDetalle />} />
          <Route path="/anillos"           element={<Anillos />} />
          <Route path="/carrito"           element={<Carrito />} />
          <Route path="/historial"         element={<Historial />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/bolsas-suerte"     element={<BolsasSuerte />} />
          <Route path="/acercaDe"     element={<AcercaDe />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App;