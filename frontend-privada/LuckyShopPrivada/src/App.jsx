import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Ventas from './pages/Ventas.jsx'
import Productos from "./pages/productos.jsx"
import Clientes from './pages/Clientes.jsx'
import Bolsas from './pages/Bolsas.jsx'
import RecoveryPasswordAdmin from './pages/RecoveryPasswordAdmin.jsx'
import PerfilAdmin from './pages/PerfilPriv.jsx'
import Finanzas from './pages/Finanzas.jsx'
import VideosCombos from './pages/VideosCombos.jsx'
import PromocionesAdmin from './pages/Promociones.jsx'

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/recovery-password" element={<RecoveryPasswordAdmin />} />
          <Route
            path="/perfilAdmin"
            element={
              <ProtectedRoute>
                <PerfilAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />
           <Route
            path="/promociones"
            element={
              <ProtectedRoute>
                <PromocionesAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bolsasSuerte"
            element={
              <ProtectedRoute>
                <Bolsas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videosCombos"
            element={
              <ProtectedRoute>
                <VideosCombos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finanzas"
            element={
              <ProtectedRoute>
                <Finanzas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AdminAuthProvider>
  )
}

export default App;;