// Productos.jsx — CRUD completo de productos de Lucky Shop
// Fetch directo en la página, sin services, mismo patrón del proyecto de referencia
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../../../../frontend-privada/LuckyShopPrivada/src/components/Nav'
import ProductoForm from '../../../../frontend-privada/LuckyShopPrivada/src/components/ProductoForm'
import ConfirmModal from '../components/ConfirmModal'

const BASE_URL = 'http://localhost:4000/api/productos'

const ESTADO_STYLES = {
  activo:   'bg-emerald-100 text-emerald-700',
  inactivo: 'bg-gray-100 text-gray-600',
  agotado:  'bg-red-100 text-red-700',
}

const Productos = () => {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('luckyshop_token') || sessionStorage.getItem('luckyshop_token')

  //  Lista y filtros 
  const [productos,       setProductos]       = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [searchTerm,      setSearchTerm]      = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [estadoFilter,    setEstadoFilter]    = useState('')
  const [currentPage,     setCurrentPage]     = useState(1)
  const itemsPerPage = 8

  // Formulario 
  const [showForm,     setShowForm]     = useState(false)
  const [editingItem,  setEditingItem]  = useState(null)
  const [submitting,   setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState('')
  const [formSuccess,  setFormSuccess]  = useState('')

  // Confirmación borrar 
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [deleteId,     setDeleteId]     = useState(null)

  //  Auth guard
  useEffect(() => {
    if (!token) navigate('/')
  }, [navigate, token])

  //  Cargar productos 
  useEffect(() => {
    if (!token) return
    const fetchProductos = async () => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (searchTerm)      params.append('search',    searchTerm)
        if (categoriaFilter) params.append('categoria', categoriaFilter)
        if (estadoFilter)    params.append('estado',    estadoFilter)

        const res = await fetch(`${BASE_URL}${params.toString() ? `?${params}` : ''}`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Error al cargar productos')
        const data = await res.json()
        setProductos(data)
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    // Debounce para el search
    const delay = setTimeout(fetchProductos, 300)
    return () => clearTimeout(delay)
  }, [token, searchTerm, categoriaFilter, estadoFilter])

  //  Paginación 
  const totalPages   = Math.max(1, Math.ceil(productos.length / itemsPerPage))
  const startIndex   = (currentPage - 1) * itemsPerPage
  const currentItems = productos.slice(startIndex, startIndex + itemsPerPage)

  //  Crear 
  const handleCreate = async (formData) => {
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Error al crear el producto')
      }
      setFormSuccess('Producto creado correctamente.')
      setShowForm(false)
      setEditingItem(null)
      setCurrentPage(1)
      // Refrescar lista
      const refreshed = await fetch(BASE_URL, { credentials: 'include' })
      setProductos(await refreshed.json())
    } catch (err) {
      setFormError(err.message || 'No se pudo crear el producto')
    } finally {
      setSubmitting(false)
    }
  }

  //  Actualizar 
  const handleUpdate = async (formData) => {
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE_URL}/${editingItem._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Error al actualizar el producto')
      }
      const { producto } = await res.json()
      setProductos((prev) => prev.map((p) => (p._id === producto._id ? producto : p)))
      setFormSuccess('Producto actualizado correctamente.')
      setShowForm(false)
      setEditingItem(null)
    } catch (err) {
      setFormError(err.message || 'No se pudo actualizar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  //  Eliminar 
  const confirmDelete = async () => {
    if (!deleteId) return
    setFormError('')
    setFormSuccess('')
    setShowConfirm(false)
    try {
      const res = await fetch(`${BASE_URL}/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Error al eliminar el producto')
      setProductos((prev) => prev.filter((p) => p._id !== deleteId))
      setFormSuccess('Producto eliminado correctamente.')
      setDeleteId(null)
    } catch (err) {
      setFormError(err.message || 'No se pudo eliminar el producto')
      setDeleteId(null)
    }
  }

  //  Toggle estado 
  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Error al cambiar estado')
      const { estado } = await res.json()
      setProductos((prev) => prev.map((p) => (p._id === id ? { ...p, estado } : p)))
      setFormSuccess(`Producto ${estado} correctamente.`)
    } catch (err) {
      setFormError(err.message)
    }
  }

  //  Stats rápidas 
  const stats = {
    total:     productos.length,
    activos:   productos.filter((p) => p.estado === 'activo').length,
    agotados:  productos.filter((p) => p.estado === 'agotado').length,
    inactivos: productos.filter((p) => p.estado === 'inactivo').length,
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {token && <Nav />}

      <main className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-400 mt-1">Gestiona el catálogo de Lucky Shop</p>
          </div>

          {/* Stats rápidas */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-pink-100 text-center">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-pink-100 text-center">
              <p className="text-xs text-gray-400">Activos</p>
              <p className="text-xl font-bold text-emerald-600">{stats.activos}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-pink-100 text-center">
              <p className="text-xs text-gray-400">Agotados</p>
              <p className="text-xl font-bold text-amber-500">{stats.agotados}</p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingItem(null); setShowForm((s) => !s) }}
              className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors shadow-sm"
            >
              + Nuevo producto
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {formError   && <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{formError}</div>}
        {formSuccess && <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{formSuccess}</div>}

        {/* Formulario modal */}
        {showForm && (
          <ProductoForm
            initialData={editingItem || {}}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            submitting={submitting}
            onClose={() => { setShowForm(false); setEditingItem(null) }}
          />
        )}

        {/* Confirm eliminar */}
        <ConfirmModal
          isOpen={showConfirm}
          title="¿Eliminar producto?"
          message="Esta acción no se puede deshacer. Las imágenes también serán eliminadas de Cloudinary."
          onConfirm={confirmDelete}
          onCancel={() => { setShowConfirm(false); setDeleteId(null) }}
        />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              placeholder="Buscar por nombre..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 shadow-sm"
            />
          </div>
          <select
            value={categoriaFilter}
            onChange={(e) => { setCategoriaFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-pink-400 shadow-sm"
          >
            <option value="">Todas las categorías</option>
            <option value="anillos">Anillos</option>
            <option value="pulseras">Pulseras</option>
            <option value="collares">Collares</option>
            <option value="aretes">Aretes</option>
            <option value="pendientes">Pendientes</option>
            <option value="otros">Otros</option>
          </select>
          <select
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-pink-400 shadow-sm"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-pink-100">
          <div className="border-b border-gray-100 px-6 py-4 bg-pink-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Catálogo de productos</h2>
            <span className="text-xs text-gray-400">{productos.length} resultado{productos.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                <p className="text-sm">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 px-4 py-6 text-red-700 text-sm text-center">{error}</div>
            ) : productos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <span className="text-4xl">💍</span>
                <p className="text-sm">No se encontraron productos</p>
                <button
                  onClick={() => { setEditingItem(null); setShowForm(true) }}
                  className="rounded-2xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
                >
                  Agregar el primero
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Producto</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Categoría</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Precio</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Stock</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Estado</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {currentItems.map((p) => (
                      <tr key={p._id} className="hover:bg-pink-50 transition-colors">

                        {/* Producto */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.imagenPresentacion ? (
                              <img
                                src={p.imagenPresentacion}
                                alt={p.nombre}
                                className="w-11 h-11 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-xl flex-shrink-0">
                                💍
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{p.nombre}</p>
                              {p.subCategoria && (
                                <p className="text-xs text-gray-400 capitalize">{p.subCategoria}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-pink-50 text-pink-600 text-xs font-medium px-3 py-1 capitalize">
                            {p.idCategoria || '—'}
                          </span>
                        </td>

                        {/* Precio */}
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ${Number(p.precio).toFixed(2)}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {p.stock}
                          </span>
                        </td>

                        {/* Estado — clic para cambiar */}
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(p._id)}
                            title="Clic para cambiar estado"
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-opacity hover:opacity-70 ${ESTADO_STYLES[p.estado] || ESTADO_STYLES.inactivo}`}
                          >
                            {p.estado}
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 min-w-[90px]">
                            <button
                              type="button"
                              onClick={() => { setEditingItem(p); setShowForm(true) }}
                              className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => { setDeleteId(p._id); setShowConfirm(true) }}
                              className="rounded-full bg-red-600 px-3 py-1 text-xs text-white font-medium hover:bg-red-700 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-5 flex flex-col gap-3 rounded-3xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500">
                      Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Anterior
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          type="button"
                          onClick={() => setCurrentPage(i + 1)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-pink-500 text-white shadow-sm'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Productos
