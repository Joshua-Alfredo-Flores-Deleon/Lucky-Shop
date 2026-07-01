import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Clientes from './pages/Clientes.jsx'
import Bolsas from './pages/Bolsas.jsx'
import RecoveryPasswordAdmin from './pages/RecoveryPasswordAdmin.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
        <Route
          path="/clientes"
          element={
            <ProtectedRoute userType="admin">
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bolsasSuerte"
          element={
            <ProtectedRoute userType="admin">
              <Bolsas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;