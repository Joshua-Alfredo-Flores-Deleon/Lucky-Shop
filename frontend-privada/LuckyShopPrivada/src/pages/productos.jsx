import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from '../components/sideBar'
import '../productos.css'
import '../productosPage.css'

const BASE_URL = 'http://localhost:4000/api'

const CATEGORIAS = ['Todo', 'Anillos', 'Pulseras', 'Aretes', 'Charms', 'Bolsas', 'Collares', 'Otros']
const SUBCATEGORIAS = ['Oro', 'Plata', 'Dorado', 'Plateado', 'Multicolor', 'Otro']
const ESTADOS = ['activo', 'inactivo', 'agotado']
const PRODUCTOS_POR_PAGINA = 8

/*  SUBCOMPONENTES DE MODALES   */

// Modal de confirmación
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

// Modal de éxito
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

// Modal de detalles del producto
const DetallesModal = ({ producto, onClose }) => {
  if (!producto) return null
  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal pm-detalles-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-detalles-header">
          <span className="pm-detalles-bar"></span>
          <h2>Detalles de producto</h2>
        </div>
        <div className="pm-detalles-body">
          <div className="pm-detalles-img-wrap">
            {producto.imagenPresentacion
              ? <img src={producto.imagenPresentacion} alt={producto.nombre} />
              : <div className="pm-no-img">Sin imagen</div>}
          </div>
          <div className="pm-detalles-info">
            <div className="pm-info-row">
              <div>
                <span className="pm-info-label">Nombre de producto</span>
                <p className="pm-info-val">{producto.nombre}</p>
              </div>
            </div>
            <div className="pm-info-row pm-info-2col">
              <div>
                <span className="pm-info-label">Categoría</span>
                <p className="pm-info-val">{producto.idCategoria || '—'}</p>
              </div>
              <div>
                <span className="pm-info-label">Subcategoría</span>
                <p className="pm-info-val">{producto.subCategoria || '—'}</p>
              </div>
            </div>
            <div className="pm-info-row pm-info-2col">
              <div>
                <span className="pm-info-label">Estado</span>
                <p className="pm-info-val">{producto.estado}</p>
              </div>
              <div>
                <span className="pm-info-label">Cantidad</span>
                <p className="pm-info-val">{producto.stock} unidades</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pm-detalles-footer">
          <div>
            <span className="pm-info-label">Descripción</span>
            <p className="pm-info-val">{producto.descripcion || '—'}</p>
          </div>
          <div className="pm-detalles-price">
            <span className="pm-info-label">Precio</span>
            <p className="pm-price-big">${Number(producto.precio).toFixed(2)}</p>
          </div>
        </div>
        <div className="pm-detalles-actions">
          <button className="pm-btn pm-btn-dark" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  )
}

// Modal de Agregar / Editar producto
const FormModal = ({ modo, producto, onClose, onConfirmRequest }) => {
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    precio: producto?.precio || '',
    stock: producto?.stock || 1,
    descripcion: producto?.descripcion || '',
    idCategoria: producto?.idCategoria || '',
    subCategoria: producto?.subCategoria || SUBCATEGORIAS[0],
    estado: producto?.estado || 'activo',
  })
  const [imagenPreview, setImagenPreview] = useState(producto?.imagenPresentacion || null)
  const [imageFile, setImageFile] = useState(null)
  const fileRef = useRef()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.precio) return
    onConfirmRequest({ form, imageFile, productoId: producto?._id })
  }

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal pm-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-form-header">
          <span className="pm-detalles-bar"></span>
          <h2>{modo === 'agregar' ? 'Nuevo producto' : 'Editar producto'}</h2>
        </div>
        <div className="pm-form-body">
          {/* Columna imagen */}
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

          {/* Columna campos */}
          <div className="pm-form-fields">
            <div className="pm-field-group">
              <label>Nombre de producto</label>
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
                <select name="idCategoria" value={form.idCategoria} onChange={handleChange} className="pm-input">
                  <option value="">Seleccionar</option>
                  {CATEGORIAS.filter(c => c !== 'Todo').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="pm-field-group">
                <label>Subcategoría</label>
                <select name="subCategoria" value={form.subCategoria} onChange={handleChange} className="pm-input">
                  {SUBCATEGORIAS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pm-field-row">
              <div className="pm-field-group">
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange} className="pm-input">
                  {ESTADOS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="pm-field-group">
                <label>Cantidad</label>
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
                placeholder="Descripción del producto..."
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
/*  COMPONENTE PRINCIPAL                                     */
/* ────────────────────────────────────────────────────────── */
const Productos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filtros
  const [categoriaActiva, setCategoriaActiva] = useState('Todo')
  const [busqueda, setBusqueda] = useState('')

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1)

  // Modales
  const [modalDetalles, setModalDetalles] = useState(null)        // producto
  const [modalForm, setModalForm] = useState(null)                // { modo: 'agregar'|'editar', producto? }
  const [modalConfirm, setModalConfirm] = useState(null)          // { mensaje, onConfirm }
  const [modalSuccess, setModalSuccess] = useState(null)          // mensaje string

  /* ── Fetch productos ── */
  const fetchProductos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (categoriaActiva !== 'Todo') params.set('categoria', categoriaActiva)
      if (busqueda.trim()) params.set('search', busqueda.trim())
      const res = await fetch(`${BASE_URL}/productos?${params}`)
      if (!res.ok) throw new Error('Error al obtener productos')
      const data = await res.json()
      setProductos(data)
      setPaginaActual(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [categoriaActiva, busqueda])

  useEffect(() => { fetchProductos() }, [fetchProductos])

  /* ── Paginación ── */
  const totalPaginas = Math.ceil(productos.length / PRODUCTOS_POR_PAGINA)
  const productosPagina = productos.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  )

  /* ── Helpers de confirm ── */
  const pedirConfirmacion = (mensaje, onConfirm) => {
    setModalConfirm({ mensaje, onConfirm })
  }

  /* ── CRUD handlers ── */

  // AGREGAR: el formulario pide confirmación antes de enviar
  const handleNuevoProducto = () => {
    setModalForm({ modo: 'agregar', producto: null })
  }

  const handleFormConfirmRequest = ({ form, imageFile, productoId }) => {
    const esEditar = !!productoId
    pedirConfirmacion(
      esEditar
        ? '¿Estás segura que deseas guardar los cambios?'
        : '¿Estás segura que deseas agregar este producto?',
      async () => {
        setModalConfirm(null)
        setModalForm(null)
        try {
          const fd = new FormData()
          Object.entries(form).forEach(([k, v]) => fd.append(k, v))
          if (imageFile) fd.append('imagenes', imageFile)

          const url = esEditar ? `${BASE_URL}/productos/${productoId}` : `${BASE_URL}/productos`
          const method = esEditar ? 'PUT' : 'POST'
          const res = await fetch(url, { method, body: fd })
          if (!res.ok) throw new Error('Error en la operación')
          setModalSuccess(esEditar ? '¡Producto actualizado con éxito!' : '¡Producto agregado con éxito!')
          fetchProductos()
        } catch (err) {
          alert('Error: ' + err.message)
        }
      }
    )
  }

  // EDITAR
  const handleEditar = (producto) => {
    setModalForm({ modo: 'editar', producto })
  }

  // ELIMINAR
  const handleEliminar = (producto) => {
    pedirConfirmacion(
      `¿Estás segura que deseas eliminar este producto?`,
      async () => {
        setModalConfirm(null)
        try {
          const res = await fetch(`${BASE_URL}/productos/${producto._id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Error al eliminar')
          setModalSuccess('¡Producto eliminado con éxito!')
          fetchProductos()
        } catch (err) {
          alert('Error: ' + err.message)
        }
      }
    )
  }

  /* ── Etiqueta de estado ── */
  const estadoBadge = (estado) => {
    const map = { activo: 'Disponible', inactivo: 'Inactivo', agotado: 'Agotado' }
    const cls = { activo: 'badge-activo', inactivo: 'badge-inactivo', agotado: 'badge-agotado' }
    return <span className={`pm-badge ${cls[estado] || ''}`}>{map[estado] || estado}</span>
  }

  /* ── RENDER ── */
  return (
    <div className="pm-page">
      <Sidebar />

      <main className="pm-main">
        {/* ENCABEZADO */}
        <div className="pm-header">
          <div className="pm-title-wrap">
            <h1 className="pm-title">Productos</h1>
            <div className="pm-title-underline"></div>
          </div>
          <div className="pm-header-actions">
            <div className="pm-search-wrap">
              <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                className="pm-search-input"
                placeholder="Buscar producto"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <button className="pm-btn pm-btn-dark pm-btn-nuevo" onClick={handleNuevoProducto}>
              <span>＋</span> Nuevo producto
            </button>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="pm-categorias">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              className={`pm-cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        {loading && (
          <div className="pm-loading">
            <div className="pm-spinner"></div>
            <span>Cargando productos...</span>
          </div>
        )}

        {error && !loading && (
          <div className="pm-error">
            <span>⚠ {error}</span>
            <button onClick={fetchProductos}>Reintentar</button>
          </div>
        )}

        {!loading && !error && productosPagina.length === 0 && (
          <div className="pm-empty">
            <div className="pm-empty-icon">📦</div>
            <p>No se encontraron productos</p>
          </div>
        )}

        {/* GRID DE PRODUCTOS */}
        {!loading && !error && productosPagina.length > 0 && (
          <div className="pm-grid">
            {productosPagina.map(prod => (
              <div key={prod._id} className="pm-card">
                {/* Imagen */}
                <div className="pm-card-img-wrap">
                  {prod.imagenPresentacion
                    ? <img src={prod.imagenPresentacion} alt={prod.nombre} className="pm-card-img" />
                    : <div className="pm-card-no-img">Sin imagen</div>}
                  {estadoBadge(prod.estado)}
                </div>
                {/* Info */}
                <div className="pm-card-info">
                  <p className="pm-card-nombre">{prod.nombre}</p>
                  <p className="pm-card-precio">${Number(prod.precio).toFixed(2)}</p>
                  <span className="pm-card-stock">{prod.stock} unidades</span>
                </div>
                {/* Acciones */}
                <div className="pm-card-actions">
                  <div className="pm-card-icons">
                    <button
                      className="pm-icon-btn pm-edit-btn"
                      title="Editar"
                      onClick={() => handleEditar(prod)}
                    >
                      ✏
                    </button>
                    <button
                      className="pm-icon-btn pm-delete-btn"
                      title="Eliminar"
                      onClick={() => handleEliminar(prod)}
                    >
                      🗑
                    </button>
                  </div>
                  <button
                    className="pm-ver-detalles"
                    onClick={() => setModalDetalles(prod)}
                  >
                    Ver detalles ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINACIÓN */}
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

      {/* ── MODALES ── */}
      {modalDetalles && (
        <DetallesModal producto={modalDetalles} onClose={() => setModalDetalles(null)} />
      )}

      {modalForm && (
        <FormModal
          modo={modalForm.modo}
          producto={modalForm.producto}
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
    </div>
  )
}

export default Productos
