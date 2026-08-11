import { useState } from 'react'
import Sidebar from '../components/sideBar'
import Nav from '../components/Nav'
import NotificacionesModal from '../components/NotificationsModal'
import { useVideosCombos } from '../hooks/useVideosCombos'
import '../sideBar.css'
import '../productosPage.css'
import '../videosCombosPage.css'

/* ── Helpers ── */
const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-SV', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getNombreCliente = (idCliente) => {
  if (!idCliente) return 'Sin cliente'
  if (typeof idCliente === 'string') return idCliente
  return idCliente.nombre || idCliente.name || idCliente.email || 'Sin nombre'
}

const getNombreCombo = (idCombo, index) => {
  if (!idCombo) return `Combo suerte ${index + 1}`
  if (typeof idCombo === 'string') return `Combo suerte ${index + 1}`
  return idCombo.nombre || `Combo suerte ${index + 1}`
}

const getStatusInfo = (status) => {
  if (status === true)  return { label: 'Aceptada',  clase: 'aceptada' }
  if (status === false) return { label: 'Denegada',  clase: 'denegada' }
  return                       { label: 'Pendiente', clase: 'pendiente' }
}

/* ── Iconos ── */
const IconoPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
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

const IconoCerrar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const IconoVideoVacio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="15" height="13" rx="2" />
    <path d="M17 10l5-2v8l-5-2V10z" />
    <line x1="7" y1="12" x2="11" y2="12" />
  </svg>
)

/* ── Modal: reproducción de video ── */
const VideoModal = ({ combo, onClose }) => {
  if (!combo) return null
  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-box" onClick={e => e.stopPropagation()}>
        <div className="vc-modal-header">
          <h3>{combo._nombre}</h3>
          <button className="vc-modal-close" onClick={onClose}><IconoCerrar /></button>
        </div>
        {combo.urlVideo ? (
          <video controls autoPlay src={combo.urlVideo} />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            Sin video disponible
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Modal: detalles + acciones de aceptar/denegar ── */
const DetalleModal = ({ combo, onClose, onAceptar, onDenegar }) => {
  if (!combo) return null
  const { label, clase } = getStatusInfo(combo.status)

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-detalle-modal" onClick={e => e.stopPropagation()}>
        <span className="vc-detalle-bar" />
        <h2>Detalles del combo</h2>

        <div className="vc-detalle-row">
          <div className="vc-detalle-label">Combo</div>
          <div className="vc-detalle-val">{combo._nombre}</div>
        </div>
        <div className="vc-detalle-row">
          <div className="vc-detalle-label">Cliente</div>
          <div className="vc-detalle-val">{getNombreCliente(combo.idCliente)}</div>
        </div>
        <div className="vc-detalle-row">
          <div className="vc-detalle-label">Fecha</div>
          <div className="vc-detalle-val">{formatFecha(combo.createdAt)}</div>
        </div>
        <div className="vc-detalle-row">
          <div className="vc-detalle-label">Estado actual</div>
          <div className="vc-detalle-val">
            <span className={`vc-badge ${clase}`}>
              <span className="vc-badge-dot" />
              {label}
            </span>
          </div>
        </div>

        <div className="vc-detalle-actions">
          <button className="vc-btn-cerrar" onClick={onClose}>Cerrar</button>
          {combo.status !== false && (
            <button className="vc-btn-denegar" onClick={() => { onDenegar(combo._id); onClose() }}>
              Denegar
            </button>
          )}
          {combo.status !== true && (
            <button className="vc-btn-aceptar" onClick={() => { onAceptar(combo._id); onClose() }}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Modal: confirmación de eliminación ── */
const ConfirmEliminarModal = ({ combo, onClose, onConfirm }) => (
  <div className="vc-modal-overlay" onClick={onClose}>
    <div className="vc-confirm-modal" onClick={e => e.stopPropagation()}>
      <div className="vc-confirm-icon">!</div>
      <h2>Confirmación</h2>
      <p>
        ¿Estás segura que deseas eliminar el combo de{' '}
        <strong>{getNombreCliente(combo.idCliente)}</strong>?
      </p>
      <div className="vc-confirm-btns">
        <button className="pm-btn pm-btn-confirm" onClick={onConfirm}>
          Sí, eliminar
        </button>
        <button className="pm-btn pm-btn-cancel" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════════════════════════════
   Página principal: Videos Combos
   ════════════════════════════════════════════════════════════ */
const VideosCombos = () => {
  const {
    combos,
    totalCombos,
    loading,
    error,
    busqueda,
    setBusqueda,
    filtroStatus,
    setFiltroStatus,
    fetchCombos,
    actualizarStatus,
    eliminarCombo,
  } = useVideosCombos()

  const [notifAbierta, setNotifAbierta] = useState(false)
  const [modalVideo, setModalVideo]     = useState(null)
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)

  /* ── Acciones CRUD ── */
  const handleAceptar = async (id) => {
    try { await actualizarStatus(id, true) }
    catch (err) { alert('Error: ' + err.message) }
  }

  const handleDenegar = async (id) => {
    try { await actualizarStatus(id, false) }
    catch (err) { alert('Error: ' + err.message) }
  }

  const handleEliminar = async () => {
    try {
      await eliminarCombo(modalEliminar._id)
      setModalEliminar(null)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const FILTROS = ['Todos', 'Aceptada', 'Denegada']

  return (
    <div className="pm-page">
      <Sidebar />

      <main className="pm-main">
        <Nav openNotifications={() => setNotifAbierta(true)} />

        {/* ── Encabezado ── */}
        <div className="pm-header">
          <div className="pm-title-wrap">
            <h1 className="pm-title">Videos combos</h1>
            <div className="pm-title-underline" />
          </div>
        </div>

        {/* ── Toolbar: filtros + búsqueda ── */}
        <div className="vc-toolbar">
          <div className="vc-filter-group">
            {FILTROS.map((f) => (
              <button
                key={f}
                className={`vc-filter-btn ${filtroStatus === f ? 'activo' : ''}`}
                onClick={() => setFiltroStatus(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="pm-search-wrap" style={{ marginLeft: 'auto' }}>
            <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="pm-search-input"
              placeholder="Buscar cliente"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && !loading && (
          <div className="pm-error">
            <span>⚠ {error}</span>
            <button onClick={fetchCombos}>Reintentar</button>
          </div>
        )}

        {/* ── Lista ── */}
        {!error && (
          <div className="vc-list">

            {loading && (
              <div className="vc-empty">
                <p>Cargando videos combos…</p>
              </div>
            )}

            {!loading && combos.length === 0 && (
              <div className="vc-empty">
                <IconoVideoVacio />
                <p>No se encontraron videos combos.</p>
              </div>
            )}

            {!loading && combos.map((combo, index) => {
              const { label, clase } = getStatusInfo(combo.status)
              const nombreCombo  = getNombreCombo(combo.idCombo, index)
              const nombreCliente = getNombreCliente(combo.idCliente)
              // Enriquecemos el objeto con el nombre calculado para pasarlo a modales
              const comboConNombre = { ...combo, _nombre: nombreCombo }

              return (
                <div className="vc-card" key={combo._id}>

                  {/* Miniatura del video */}
                  <div
                    className="vc-video-thumb"
                    onClick={() => setModalVideo(comboConNombre)}
                    title="Ver video"
                  >
                    {combo.urlVideo ? (
                      <>
                        <video src={combo.urlVideo} muted preload="metadata" />
                        <div className="vc-play-overlay">
                          <IconoPlay />
                        </div>
                      </>
                    ) : (
                      <div className="vc-video-no-url">Sin video</div>
                    )}
                  </div>

                  {/* Info del combo */}
                  <div className="vc-info">
                    <p className="vc-combo-nombre">{nombreCombo}</p>
                    <div className="vc-meta">
                      <span><strong>Cliente:</strong> {nombreCliente}</span>
                      <span><strong>Fecha:</strong> {formatFecha(combo.createdAt)}</span>
                    </div>
                  </div>

                  {/* Badge de status */}
                  <div className="vc-badge-wrap">
                    <span className={`vc-badge ${clase}`}>
                      <span className="vc-badge-dot" />
                      {label}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="vc-acciones">
                    <button
                      className="vc-btn-detalle"
                      onClick={() => setModalDetalle(comboConNombre)}
                    >
                      Ver detalles &gt;
                    </button>
                    <button
                      className="vc-icon-btn"
                      title="Eliminar"
                      onClick={() => setModalEliminar(comboConNombre)}
                    >
                      <IconoBasura />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── Modales ── */}
      {modalVideo && (
        <VideoModal combo={modalVideo} onClose={() => setModalVideo(null)} />
      )}

      {modalDetalle && (
        <DetalleModal
          combo={modalDetalle}
          onClose={() => setModalDetalle(null)}
          onAceptar={handleAceptar}
          onDenegar={handleDenegar}
        />
      )}

      {modalEliminar && (
        <ConfirmEliminarModal
          combo={modalEliminar}
          onClose={() => setModalEliminar(null)}
          onConfirm={handleEliminar}
        />
      )}

      <NotificacionesModal abierto={notifAbierta} onCerrar={() => setNotifAbierta(false)} />
    </div>
  )
}

export default VideosCombos
