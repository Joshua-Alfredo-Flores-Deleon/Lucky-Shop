import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Clientes from './pages/Clientes.jsx'
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
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  )
}

export default App
