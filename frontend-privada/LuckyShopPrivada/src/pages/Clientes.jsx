import { useState } from 'react'
import Sidebar from '../components/sideBar'
import Nav from '../components/Nav'
import NotificacionesModal from '../components/NotificationsModal'
import { useClientes } from '../hooksP/useClientes'
import '../sideBar.css'
import '../clientes.css'

const getInitials = (name, lastName) => {
  const n = name ? name[0].toUpperCase() : ''
  const l = lastName ? lastName[0].toUpperCase() : ''
  return (n + l) || '?'
}

const Clientes = () => {
  const {
    clientes: clientesFiltrados,
    busqueda,
    setBusqueda,
    loading,
  } = useClientes()

  const [notifAbierta, setNotifAbierta] = useState(false)

  return (
    <div className="clientes-wrapper">
      <Sidebar />

      <main className="clientes-content-area">
        <Nav openNotifications={() => setNotifAbierta(true)} />
        <div className="clientes-header">
          <h1 className="clientes-title">Clientes</h1>
          <p className="clientes-subtitle">
            Consulta y administra fácilmente la información de tus clientes
          </p>
        </div>

        <div className="clientes-search-row">
          <div className="clientes-search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="clientes-search-input"
            />
          </div>
        </div>

        <div className="clientes-table-container">
          <table className="clientes-table">
            <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Correo</th>
                </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="loading-cell">Cargando clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-cell">No se encontraron clientes</td>
                </tr>
              ) : (
                clientesFiltrados.map(cliente => (
                  <tr key={cliente._id} className="cliente-row">
                    <td>
                      <div className="cliente-nombre-cell">
                        <div className="cliente-avatar">
                          {getInitials(cliente.name, cliente.lastName)}
                        </div>
                        <span className="cliente-nombre">
                          {`${cliente.name || ''} ${cliente.lastName || ''}`.trim() || 'Sin nombre'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`estado-badge ${cliente.isVerified ? 'activo' : 'inactivo'}`}>
                        {cliente.isVerified ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="cliente-email">{cliente.email || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <NotificacionesModal abierto={notifAbierta} onCerrar={() => setNotifAbierta(false)} />
    </div>
  )
}

export default Clientes;
