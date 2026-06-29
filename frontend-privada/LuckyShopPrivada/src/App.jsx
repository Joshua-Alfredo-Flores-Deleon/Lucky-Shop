import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Productos from './pages/productos.jsx'

function App() {
  return (
      <Router>
        <Routes>

          <Route path="/productos" element={<Productos />} />

        </Routes>
      </Router>
  )
}

export default App