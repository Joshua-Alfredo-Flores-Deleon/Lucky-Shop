import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'

// Admin
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'

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

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ── Admin ── */}
          <Route path="/"          element={<Login />} />
          <Route path="/home"      element={<Home />} />
          <Route path="/productos" element={<Productos />} />

          {/* ── Cliente público ── */}
          <Route path="/inicio"            element={<HomeCliente />} />
          <Route path="/login"             element={<LoginCliente />} />
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