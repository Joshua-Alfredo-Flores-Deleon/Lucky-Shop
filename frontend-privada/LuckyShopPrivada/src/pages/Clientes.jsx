import { useState, useMemo, useCallback } from 'react'
import Sidebar from '../components/SideBar'
import Nav from '../components/Nav'
import NotificacionesModal from '../components/NotificationsModal'
import { useClientes } from '../hooks/useClientes'
import '../SideBar.css'
import '../clientes.css'

// Límite de días sin ingresar para considerar a un cliente como activo
const DIAS_ACTIVIDAD = 30 

// Extrae las iniciales del nombre y apellido para el avatar
const getInitials = (name = '', lastName = '') => {
  const n = name.trim()[0]?.toUpperCase() || ''
  const l = lastName.trim()[0]?.toUpperCase() || ''
  return (n + l) || '?'
}

// Determina si el cliente ha iniciado sesión dentro del límite establecido
const estaActivo = (ultimoAcceso) => {
  if (!ultimoAcceso) return false
  const dias = (Date.now() - new Date(ultimoAcceso).getTime()) / (1000 * 60 * 60 * 24)
  return dias <= DIAS_ACTIVIDAD
}

// Da formato legible a la fecha del último acceso
const formatoUltimoAcceso = (fecha) => {
  if (!fecha) return 'Nunca'
  return new Date(fecha).toLocaleDateString('es-SV', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const Clientes = () => {
  // Datos y lógica obtenidos desde el hook personalizado
  const {
    clientes: clientesFiltrados,
    busqueda,
    setBusqueda,
    loading,
    eliminarCliente,
  } = useClientes()

  // Estados locales para el control de la interfaz y modales
  const [clienteVer, setClienteVer] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [notifAbierta, setNotifAbierta] = useState(false)

  // Función memorizada para procesar la eliminación y cerrar el modal
  const handleEliminarCliente = useCallback(async (id) => {
    const ok = await eliminarCliente(id)
    if (ok) setClienteEliminar(null)
  }, [eliminarCliente])

  return (
    <div className="clientes-wrapper">
      <Sidebar />

      <main className="clientes-content-area">
        <Nav openNotifications={() => setNotifAbierta(true)} />
        
        {/* Encabezado de la página */}
        <header className="clientes-header">
          <h1 className="clientes-title">Clientes</h1>
          <p className="clientes-subtitle">
            Consulta y administra fácilmente la información de tus clientes
          </p>
        </header>

        {/* Campo de búsqueda */}
        <section className="clientes-search-row">
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
        </section>

        {/* Tabla principal de datos */}
        <section className="clientes-table-container">
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
                /* Mapeo de la lista de clientes utilizando el subcomponente ClienteRow */
                clientesFiltrados.map(cliente => (
                  <ClienteRow 
                    key={cliente._id} 
                    cliente={cliente} 
                    onVer={setClienteVer} 
                    onEliminar={setClienteEliminar} 
                  />
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Rendering condicional de modales */}
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

// Componente para renderizar la fila individual de un cliente
const ClienteRow = ({ cliente, onVer, onEliminar }) => {
  // Cálculo memorizado del estado activo/inactivo para evitar reevaluaciones en cada render
  const activo = useMemo(() => estaActivo(cliente.ultimoAcceso), [cliente.ultimoAcceso])
  const nombreCompleto = `${cliente.name || ''} ${cliente.lastName || ''}`.trim() || 'Sin nombre'

  return (
    <tr className="cliente-row">
      <td>
        <div className="cliente-nombre-cell">
          <div className="cliente-avatar">
            {getInitials(cliente.name, cliente.lastName)}
          </div>
          <span className="cliente-nombre">{nombreCompleto}</span>
        </div>
      </td>
      <td>
        <span className={`estado-badge ${activo ? 'activo' : 'inactivo'}`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="cliente-email">{formatoUltimoAcceso(cliente.ultimoAcceso)}</td>
      <td className="cliente-email">{cliente.email || '—'}</td>
      <td>
        <div className="acciones-cell">
          <button
            className="accion-btn editar-btn"
            onClick={() => onVer(cliente)}
            title="Ver cliente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            className="accion-btn eliminar-btn"
            onClick={() => onEliminar(cliente)}
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
  )
}

// Modal para visualizar la información detallada del cliente (solo lectura)
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
          <div className="form-group">
            <label>Correo electrónico</label>
            <input value={cliente.email || ''} readOnly disabled />
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

// Modal de confirmación para eliminar un cliente
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