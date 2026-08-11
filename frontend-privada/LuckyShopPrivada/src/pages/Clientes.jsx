import { useState } from 'react'
import Sidebar from '../components/sideBar'
import Nav from '../components/Nav'
import NotificacionesModal from '../components/NotificationsModal'
import { useClientes } from '../hooks/useClientes'
import '../sideBar.css'
import '../clientes.css'

const DIAS_ACTIVIDAD = 30 // dentro de cuántos días desde el último acceso se considera "Activo"

const getInitials = (name, lastName) => {
  const n = name ? name[0].toUpperCase() : ''
  const l = lastName ? lastName[0].toUpperCase() : ''
  return (n + l) || '?'
}

// Un cliente está "activo" si inició sesión dentro de los últimos DIAS_ACTIVIDAD días
const estaActivo = (ultimoAcceso) => {
  if (!ultimoAcceso) return false
  const dias = (Date.now() - new Date(ultimoAcceso)) / (1000 * 60 * 60 * 24)
  return dias <= DIAS_ACTIVIDAD
}

// Fecha legible del último acceso (o "Nunca" si el cliente jamás ha iniciado sesión)
const formatoUltimoAcceso = (fecha) => {
  if (!fecha) return 'Nunca'
  return new Date(fecha).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
}

const Clientes = () => {
  const {
    clientes: clientesFiltrados,
    busqueda,
    setBusqueda,
    loading,
    eliminarCliente,
  } = useClientes()

  const [clienteVer, setClienteVer] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [notifAbierta, setNotifAbierta] = useState(false)

  const handleEliminarCliente = async (id) => {
    const ok = await eliminarCliente(id)
    if (ok) setClienteEliminar(null)
  }

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
                <th>Último acceso</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading-cell">Cargando clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-cell">No se encontraron clientes</td>
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
                      <span className={`estado-badge ${estaActivo(cliente.ultimoAcceso) ? 'activo' : 'inactivo'}`}>
                        {estaActivo(cliente.ultimoAcceso) ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="cliente-email">{formatoUltimoAcceso(cliente.ultimoAcceso)}</td>
                    <td className="cliente-email">{cliente.email || '—'}</td>
                    <td>
                      <div className="acciones-cell">
                        <button
                          className="accion-btn editar-btn"
                          onClick={() => setClienteVer(cliente)}
                          title="Ver cliente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="accion-btn eliminar-btn"
                          onClick={() => setClienteEliminar(cliente)}
                          title="Eliminar cliente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {clienteVer && (
        <VerClienteModal
          cliente={clienteVer}
          onClose={() => setClienteVer(null)}
        />
      )}

      {clienteEliminar && (
        <ConfirmDeleteModal
          cliente={clienteEliminar}
          onClose={() => setClienteEliminar(null)}
          onConfirm={() => handleEliminarCliente(clienteEliminar._id)}
        />
      )}

      <NotificacionesModal abierto={notifAbierta} onCerrar={() => setNotifAbierta(false)} />
    </div>
  )
}

/* ── Modal de solo lectura: informacion que el cliente registro, no editable ── */
const VerClienteModal = ({ cliente, onClose }) => {
  const activo = estaActivo(cliente.ultimoAcceso)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Información del Cliente</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input value={cliente.name || ''} readOnly disabled />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input value={cliente.lastName || ''} readOnly disabled />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Correo electrónico</label>
              <input value={cliente.email || ''} readOnly disabled />
            </div>
           
          </div>
          <div className="form-group">
            <label>Último acceso</label>
            <input value={formatoUltimoAcceso(cliente.ultimoAcceso)} readOnly disabled />
          </div>
           <div className="form-group">
              <label>Estado</label>
              <input value={activo ? 'Activo' : 'Inactivo'} readOnly disabled />
            </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ConfirmDeleteModal = ({ cliente, onClose, onConfirm }) => {
  const nombre = `${cliente.name || ''} ${cliente.lastName || ''}`.trim() || 'este cliente'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Eliminar Cliente</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <p className="confirm-text">
          ¿Estás seguro de que deseas eliminar a <strong>{nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-eliminar" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default Clientes;