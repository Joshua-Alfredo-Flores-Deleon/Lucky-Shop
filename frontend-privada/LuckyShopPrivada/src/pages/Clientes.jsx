import { useState, useEffect } from 'react'
import Sidebar from '../components/sideBar'
import '../productos.css'
import '../clientes.css'

const BASE_URL = 'http://localhost:4000/api'

const getInitials = (name, lastName) => {
  const n = name ? name[0].toUpperCase() : ''
  const l = lastName ? lastName[0].toUpperCase() : ''
  return (n + l) || '?'
}

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [clienteEditar, setClienteEditar] = useState(null)
  const [clienteEliminar, setClienteEliminar] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchClientes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/clientes`)
      const data = await res.json()
      setClientes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al obtener clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const eliminarCliente = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/clientes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setClientes(prev => prev.filter(c => c._id !== id))
        setClienteEliminar(null)
      }
    } catch (err) {
      console.error('Error al eliminar cliente:', err)
    }
  }

  const actualizarCliente = async (id, datos) => {
    try {
      const res = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (res.ok) {
        setClientes(prev =>
          prev.map(c => c._id === id ? { ...c, ...datos } : c)
        )
        setClienteEditar(null)
      }
    } catch (err) {
      console.error('Error al actualizar cliente:', err)
    }
  }

  const clientesFiltrados = clientes.filter(c => {
    const nombre = `${c.name || ''} ${c.lastName || ''}`.toLowerCase()
    const email = (c.email || '').toLowerCase()
    const busq = busqueda.toLowerCase()
    return nombre.includes(busq) || email.includes(busq)
  })

  return (
    <div className="clientes-wrapper">
      <Sidebar />

      <main className="clientes-content-area">
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="loading-cell">Cargando clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-cell">No se encontraron clientes</td>
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
                    <td>
                      <div className="acciones-cell">
                        <button
                          className="accion-btn editar-btn"
                          onClick={() => setClienteEditar(cliente)}
                          title="Editar cliente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="accion-btn eliminar-btn"
                          onClick={() => setClienteEliminar(cliente)}
                          title="Eliminar cliente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {clienteEditar && (
        <EditModal
          cliente={clienteEditar}
          onClose={() => setClienteEditar(null)}
          onGuardar={actualizarCliente}
        />
      )}

      {clienteEliminar && (
        <ConfirmDeleteModal
          cliente={clienteEliminar}
          onClose={() => setClienteEliminar(null)}
          onConfirm={() => eliminarCliente(clienteEliminar._id)}
        />
      )}
    </div>
  )
}

const EditModal = ({ cliente, onClose, onGuardar }) => {
  const [form, setForm] = useState({
    name: cliente.name || '',
    lastName: cliente.lastName || '',
    email: cliente.email || '',
    isVerified: cliente.isVerified || false,
    // Pass through existing values to satisfy backend validations
    password: cliente.password || '',
    birthdate: cliente.birthdate || new Date('1990-01-01').toISOString(),
    loginAttemps: cliente.loginAttemps || 0,
    timeOut: cliente.timeOut || null,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(cliente._id, form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Cliente</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Apellido"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="form-group-check">
            <input
              type="checkbox"
              name="isVerified"
              id="isVerified"
              checked={form.isVerified}
              onChange={handleChange}
            />
            <label htmlFor="isVerified">Cliente activo / verificado</label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Guardar cambios
            </button>
          </div>
        </form>
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

export default Clientes
