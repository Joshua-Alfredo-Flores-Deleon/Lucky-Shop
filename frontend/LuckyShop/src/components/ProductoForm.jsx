import { useState, useEffect, useRef } from 'react'

const CATEGORIAS = ['anillos', 'pulseras', 'collares', 'aretes', 'pendientes', 'otros']

const SUB_CATEGORIAS = {
  anillos:    ['Compromiso', 'Promesa', 'Alianza', 'Eternidad', 'Moda'],
  pulseras:   ['Charm', 'Eslabón', 'Cordón', 'Rígida'],
  collares:   ['Gargantilla', 'Largo', 'Cadena', 'Colgante'],
  aretes:     ['Argolla', 'Pasador', 'Chandelier', 'Trepador'],
  pendientes: ['Colgante', 'Botón', 'Aro'],
  otros:      ['Accesorio'],
}

const ProductoForm = ({ initialData = {}, onSubmit, submitting = false, onClose }) => {
  const isEditing = !!initialData?._id
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    nombre:      '',
    precio:      '',
    stock:       '',
    descripcion: '',
    idCategoria: '',
    subCategoria:'',
    estado:      'activo',
    ...initialData,
  })

  // Imágenes existentes (URLs) y nuevos archivos
  const [imagenesExistentes, setImagenesExistentes] = useState(initialData?.imagenes || [])
  const [nuevosFiles, setNuevosFiles]   = useState([])
  const [previews, setPreviews]         = useState(
    (initialData?.imagenes || []).map((url) => ({ src: url, existing: true }))
  )

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'idCategoria' ? { subCategoria: '' } : {}),
    }))
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    if (previews.length + files.length > 5) {
      alert('Máximo 5 imágenes permitidas')
      return
    }
    setNuevosFiles((prev) => [...prev, ...files])
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => ({ src: URL.createObjectURL(f), existing: false })),
    ])
  }

  const removeImage = (index) => {
    const item = previews[index]
    if (item.existing) {
      setImagenesExistentes((prev) => prev.filter((url) => url !== item.src))
    } else {
      // Encuentra el índice del archivo nuevo correspondiente
      const newFileIndex = previews.slice(0, index).filter((p) => !p.existing).length
      setNuevosFiles((prev) => prev.filter((_, i) => i !== newFileIndex))
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()

    // Campos de texto
    Object.entries(form).forEach(([k, v]) => {
      if (!['imagenes', 'imagenPresentacion', '__v', 'createdAt', 'updatedAt', '_id', 'source'].includes(k)) {
        formData.append(k, v)
      }
    })

    // Imágenes existentes que se conservan
    imagenesExistentes.forEach((url) => formData.append('imagenesExistentes', url))

    // Nuevas imágenes
    nuevosFiles.forEach((f) => formData.append('imagenes', f))

    onSubmit?.(formData)
  }

  const subcats = SUB_CATEGORIAS[form.idCategoria] || []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-pink-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-pink-50">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-pink-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-4 max-h-[75vh] overflow-y-auto">

          {/* Nombre + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Nombre *</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
          </div>

          {/* Precio + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Precio ($) *</label>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Stock *</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Categoría + Subcategoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Categoría</label>
              <select
                name="idCategoria"
                value={form.idCategoria}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Subcategoría</label>
              <select
                name="subCategoria"
                value={form.subCategoria}
                onChange={handleChange}
                disabled={!form.idCategoria}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors disabled:opacity-50"
              >
                <option value="">Seleccionar...</option>
                {subcats.map((s) => (
                  <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el producto..."
              rows={3}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Imágenes (máx. 5)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 py-5 cursor-pointer hover:bg-pink-100 hover:border-pink-400 transition-colors"
            >
              <span className="text-2xl">📷</span>
              <span className="text-sm text-gray-500">Haz clic para subir imágenes</span>
              <span className="text-xs text-gray-400">JPG, PNG — máx. 5 fotos</span>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </div>

            {previews.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={p.src} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    {i === 0 && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoForm
