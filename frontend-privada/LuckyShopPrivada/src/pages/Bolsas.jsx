import { useState, useRef } from 'react'
import Sidebar from '../components/sideBar'
import Nav from '../components/Nav'
import NotificacionesModal from '../components/NotificationsModal'
import { useBolsas } from '../hooks/useBolsas'
import '../sideBar.css'
import '../productosPage.css'

const ESTADOS = ['activo', 'inactivo', 'agotado']

/* ── Iconos ── */
const IconoLapiz = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IconoBasura = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)
const IconoBolsaVacia = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)

/*  SUBCOMPONENTES DE MODALES   */

const ConfirmModal = ({ mensaje, onConfirm, onCancel }) => (
  <div className="pm-overlay" onClick={onCancel}>
    <div className="pm-modal pm-confirm-modal" onClick={e => e.stopPropagation()}>
      <div className="pm-confirm-icon">
        <span>!</span>
      </div>
      <h2 className="pm-confirm-title">Confirmación</h2>
      <p className="pm-confirm-msg">{mensaje}</p>
      <div className="pm-confirm-btns">
        <button className="pm-btn pm-btn-confirm" onClick={onConfirm}>Sí, estoy segura</button>
        <button className="pm-btn pm-btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  </div>
)

const SuccessModal = ({ mensaje, onClose }) => (
  <div className="pm-overlay" onClick={onClose}>
    <div className="pm-modal pm-success-modal" onClick={e => e.stopPropagation()}>
      <div className="pm-success-icon">
        <svg viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="25" stroke="#22c55e" strokeWidth="2"/>
          <path d="M14 26l9 9 15-18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="pm-success-title">¡Completado!</h2>
      <p className="pm-success-msg">{mensaje}</p>
      <button className="pm-btn pm-btn-success-close" onClick={onClose}>Aceptar</button>
    </div>
  </div>
)

const DetallesModal = ({ bolsa, onClose, onSelectVariante }) => {
  if (!bolsa) return null
  const cantidadUnidades = bolsa.cantidadUnidades || 6
  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal pm-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-form-header">
          <span className="pm-detalles-bar"></span>
          <h2>Detalles de bolsa</h2>
        </div>
        <div className="pm-form-body">
          <div className="pm-detalle-col-izq">
            <div className="pm-form-img-box pm-form-img-box-static">
              {bolsa.imagenPresentacion
                ? <img src={bolsa.imagenPresentacion} alt={bolsa.nombre} />
                : <span className="pm-no-img">Sin imagen</span>}
            </div>
            <div className="pm-field-group pm-detalle-desc">
              <label>Descripción</label>
              <p className="pm-info-val">{bolsa.descripcion || '—'}</p>
            </div>
          </div>

          <div className="pm-form-fields">
            <div className="pm-field-group">
              <label>Nombre de bolsita</label>
              <p className="pm-info-val">{bolsa.nombre || 'Sin nombre'}</p>
            </div>
            <div className="pm-field-group">
              <label>Categoría</label>
              <p className="pm-info-val">{bolsa.categoria || '—'}</p>
            </div>
            <div className="pm-detalle-variantes">
              <button
                className={`pm-btn pm-btn-variante ${cantidadUnidades === 6 ? 'active' : ''}`}
                onClick={() => onSelectVariante(bolsa, 6)}
              >
                Bolsa de 6
              </button>
              <button
                className={`pm-btn pm-btn-variante ${cantidadUnidades === 10 ? 'active' : ''}`}
                onClick={() => onSelectVariante(bolsa, 10)}
              >
                Bolsa de 10
              </button>
            </div>
          </div>
        </div>
        <div className="pm-form-actions">
          <button className="pm-btn pm-btn-dark" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  )
}

const FormModal = ({ modo, bolsa, onClose, onConfirmRequest }) => {
  const [form, setForm] = useState({
    nombre: bolsa?.nombre || '',
    precio: bolsa?.precio || '',
    stock: bolsa?.stock || 1,
    descripcion: bolsa?.descripcion || '',
    categoria: bolsa?.categoria || '',
    cantidadUnidades: bolsa?.cantidadUnidades || 6,
    estado: bolsa?.estado || 'activo',
  })
  const [imagenPreview, setImagenPreview] = useState(bolsa?.imagenPresentacion || null)
  const [imageFile, setImageFile] = useState(null)
  const fileRef = useRef()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCantidadUnidades = (valor) => {
    setForm(prev => ({ ...prev, cantidadUnidades: valor }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.precio) return
    onConfirmRequest({ form, imageFile, bolsaId: bolsa?._id })
  }

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal pm-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-form-header">
          <span className="pm-detalles-bar"></span>
          <h2>{modo === 'agregar' ? 'Nueva bolsa' : 'Editar bolsa'}</h2>
        </div>
        <div className="pm-form-body">
          <div className="pm-form-img-col">
            <div
              className="pm-form-img-box"
              onClick={() => fileRef.current?.click()}
            >
              {imagenPreview
                ? <img src={imagenPreview} alt="preview" />
                : <span className="pm-img-plus">＋</span>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <p className="pm-form-img-label">Agregar foto</p>
          </div>

          <div className="pm-form-fields">
            <div className="pm-field-group">
              <label>Nombre de bolsa</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre..."
                className="pm-input"
              />
            </div>
            <div className="pm-field-row">
              <div className="pm-field-group">
                <label>Categoría</label>
                <input
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ej. Bolsa"
                  className="pm-input"
                />
              </div>
              <div className="pm-field-group">
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange} className="pm-input">
                  {ESTADOS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pm-field-row">
              <div className="pm-field-group">
                <label>Cantidad de unidades</label>
                <div className="pm-detalle-variantes pm-detalle-variantes-form">
                  <button
                    type="button"
                    className={`pm-btn pm-btn-variante ${Number(form.cantidadUnidades) === 6 ? 'active' : ''}`}
                    onClick={() => handleCantidadUnidades(6)}
                  >
                    Bolsa de 6
                  </button>
                  <button
                    type="button"
                    className={`pm-btn pm-btn-variante ${Number(form.cantidadUnidades) === 10 ? 'active' : ''}`}
                    onClick={() => handleCantidadUnidades(10)}
                  >
                    Bolsa de 10
                  </button>
                </div>
              </div>
              <div className="pm-field-group">
                <label>Cantidad en stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="pm-input"
                />
              </div>
            </div>
            <div className="pm-field-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="pm-input pm-textarea"
                placeholder="Descripción de la bolsa..."
              />
            </div>
            <div className="pm-field-group">
              <label>Precio</label>
              <div className="pm-price-input">
                <span>$</span>
                <input
                  type="number"
                  name="precio"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={handleChange}
                  className="pm-input"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pm-form-actions">
          {modo === 'editar' && (
            <button className="pm-btn pm-btn-cancel" onClick={onClose}>Cancelar</button>
          )}
          <button className="pm-btn pm-btn-dark" onClick={handleSubmit}>
            {modo === 'agregar' ? 'Aceptar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────── */
const Bolsas = () => {
  const {
    bolsas: bolsasPagina,
    loading,
    error,
    busqueda,
    setBusqueda,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    fetchBolsas,
    guardarBolsa,
    eliminarBolsa,
    actualizarVariante,
  } = useBolsas()

  const [notifAbierta, setNotifAbierta] = useState(false)

  const [modalDetalles, setModalDetalles] = useState(null)
  const [modalForm, setModalForm] = useState(null)
  const [modalConfirm, setModalConfirm] = useState(null)
  const [modalSuccess, setModalSuccess] = useState(null)

  const pedirConfirmacion = (mensaje, onConfirm) => {
    setModalConfirm({ mensaje, onConfirm })
  }

  const handleNuevaBolsa = () => {
    setModalForm({ modo: 'agregar', bolsa: null })
  }

  const handleFormConfirmRequest = ({ form, imageFile, bolsaId }) => {
    const esEditar = !!bolsaId
    pedirConfirmacion(
      esEditar
        ? '¿Estás segura que deseas guardar los cambios?'
        : '¿Estás segura que deseas agregar esta bolsa?',
      async () => {
        setModalConfirm(null)
        setModalForm(null)
        try {
          await guardarBolsa({ form, imageFile, bolsaId })
          setModalSuccess(esEditar ? '¡Bolsa actualizada con éxito!' : '¡Bolsa agregada con éxito!')
        } catch (err) {
          alert('Error: ' + err.message)
        }
      }
    )
  }

  const handleEditar = (bolsa) => {
    setModalForm({ modo: 'editar', bolsa })
  }

  const handleSelectVariante = async (bolsa, cantidadUnidades) => {
    try {
      await actualizarVariante(bolsa, cantidadUnidades)
      setModalDetalles(prev => prev && prev._id === bolsa._id ? { ...prev, cantidadUnidades } : prev)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleEliminar = (bolsa) => {
    pedirConfirmacion(
      `¿Estás segura que deseas eliminar esta bolsa?`,
      async () => {
        setModalConfirm(null)
        try {
          await eliminarBolsa(bolsa._id)
          setModalSuccess('¡Bolsa eliminada con éxito!')
        } catch (err) {
          alert('Error: ' + err.message)
        }
      }
    )
  }

  const estadoBadge = (estado) => {
    const map = { activo: 'Disponible', inactivo: 'Inactivo', agotado: 'Agotado' }
    const cls = { activo: 'badge-activo', inactivo: 'badge-inactivo', agotado: 'badge-agotado' }
    return <span className={`pm-badge ${cls[estado] || ''}`}>{map[estado] || estado}</span>
  }

  return (
    <div className="pm-page">
      <Sidebar />

      <main className="pm-main">
        <Nav openNotifications={() => setNotifAbierta(true)} />
        <div className="pm-header">
          <div className="pm-title-wrap">
            <h1 className="pm-title">Bolsas</h1>
            <div className="pm-title-underline"></div>
            <p className="pm-subtitle">Lista de bolsas registradas</p>
          </div>
          <div className="pm-header-actions">
            <div className="pm-search-wrap">
              <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                className="pm-search-input"
                placeholder="Buscar"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <button className="pm-btn pm-btn-dark pm-btn-nuevo" onClick={handleNuevaBolsa}>
              <span>＋</span> Agregar bolsa
            </button>
          </div>
        </div>

        {loading && (
          <div className="pm-loading">
            <div className="pm-spinner"></div>
            <span>Cargando bolsas...</span>
          </div>
        )}

        {error && !loading && (
          <div className="pm-error">
            <span>⚠ {error}</span>
            <button onClick={fetchBolsas}>Reintentar</button>
          </div>
        )}

        {!loading && !error && bolsasPagina.length === 0 && (
          <div className="pm-empty">
            <div className="pm-empty-icon"><IconoBolsaVacia /></div>
            <p>No se encontraron bolsas</p>
          </div>
        )}

        {!loading && !error && bolsasPagina.length > 0 && (
          <div className="pm-grid">
            {bolsasPagina.map(bolsa => (
              <div key={bolsa._id} className="pm-card">
                <div className="pm-card-img-wrap">
                  {bolsa.imagenPresentacion
                    ? <img src={bolsa.imagenPresentacion} alt={bolsa.nombre} className="pm-card-img" />
                    : <div className="pm-card-no-img">Sin imagen</div>}
                  {estadoBadge(bolsa.estado)}
                </div>
                <div className="pm-card-info">
                  <p className="pm-card-nombre">{bolsa.nombre || 'Sin nombre'}</p>
                  <p className="pm-card-precio">${Number(bolsa.precio || 0).toFixed(2)}</p>
                </div>
                <div className="pm-card-actions">
                  <div className="pm-card-icons">
                    <button
                      className="pm-icon-btn pm-edit-btn"
                      title="Editar"
                      onClick={() => handleEditar(bolsa)}
                    >
                      <IconoLapiz />
                    </button>
                    <button
                      className="pm-icon-btn pm-delete-btn"
                      title="Eliminar"
                      onClick={() => handleEliminar(bolsa)}
                    >
                      <IconoBasura />
                    </button>
                  </div>
                  <button
                    className="pm-ver-detalles"
                    onClick={() => setModalDetalles(bolsa)}
                  >
                    Ver detalles ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="pm-pagination">
            <button
              className="pm-page-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(p => p - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`pm-page-btn ${paginaActual === n ? 'active' : ''}`}
                onClick={() => setPaginaActual(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="pm-page-btn"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(p => p + 1)}
            >
              ›
            </button>
          </div>
        )}
      </main>

      {modalDetalles && (
        <DetallesModal
          bolsa={modalDetalles}
          onClose={() => setModalDetalles(null)}
          onSelectVariante={handleSelectVariante}
        />
      )}

      {modalForm && (
        <FormModal
          modo={modalForm.modo}
          bolsa={modalForm.bolsa}
          onClose={() => setModalForm(null)}
          onConfirmRequest={handleFormConfirmRequest}
        />
      )}

      {modalConfirm && (
        <ConfirmModal
          mensaje={modalConfirm.mensaje}
          onConfirm={modalConfirm.onConfirm}
          onCancel={() => setModalConfirm(null)}
        />
      )}

      {modalSuccess && (
        <SuccessModal
          mensaje={modalSuccess}
          onClose={() => setModalSuccess(null)}
        />
      )}

      <NotificacionesModal abierto={notifAbierta} onCerrar={() => setNotifAbierta(false)} />
    </div>
  )
}

export default Bolsas;