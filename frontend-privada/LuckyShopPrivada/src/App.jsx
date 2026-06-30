import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Productos from './pages/productos.jsx'
import Clientes from './pages/Clientes.jsx'

function App() {
  return (
      <Router>
        <Routes>

          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />

        </Routes>
      </Router>
  )
}

export default App