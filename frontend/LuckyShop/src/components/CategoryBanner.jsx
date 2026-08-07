/**
 * CategoryBanner — Banner decorativo de categoría con efecto bokeh rosa.
 * Muestra título en mayúsculas + descripción sobre un degradado premium.
 */
const CategoryBanner = ({ titulo, descripcion, subcategorias = [], onSubcat, subcatActiva }) => (
  <div
    className="relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #fbc2d4 0%, #f9d0df 25%, #fce4ec 50%, #fdeef4 75%, #fff5f9 100%)',
      minHeight: '200px',
    }}
    id="category-banner"
  >
    {/* ── Partículas bokeh decorativas ── */}
    <div className="bokeh-particle animate-float w-32 h-32 bg-white/25 right-[10%] top-[10%] blur-xl" />
    <div className="bokeh-particle animate-shimmer w-20 h-20 bg-pink-200/30 right-[25%] top-[40%] blur-lg" />
    <div className="bokeh-particle animate-drift w-40 h-40 bg-white/15 right-[5%] bottom-[5%] blur-2xl" />
    <div className="bokeh-particle animate-float w-16 h-16 bg-pink-300/20 left-[60%] top-[20%] blur-md" style={{ animationDelay: '2s' }} />
    <div className="bokeh-particle animate-shimmer w-24 h-24 bg-white/20 left-[40%] bottom-[15%] blur-xl" style={{ animationDelay: '1s' }} />
    <div className="bokeh-particle animate-drift w-12 h-12 bg-pink-100/40 right-[40%] top-[60%] blur-sm" style={{ animationDelay: '3s' }} />

    {/* ── Contenido ── */}
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
      {/* Texto */}
      <div className="max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-wider mb-3">
          {titulo}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
          {descripcion}
        </p>
      </div>

      {/* Subcategorías (si las hay) */}
      {subcategorias.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-start sm:justify-end">
          {subcategorias.map((s) => (
            <button
              key={s.value}
              onClick={() => onSubcat?.(s.value === subcatActiva ? '' : s.value)}
              className="flex flex-col items-center gap-1.5 group"
              id={`subcat-${s.value}`}
            >
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                subcatActiva === s.value
                  ? 'border-pink-500 shadow-lg shadow-pink-200/50 scale-105'
                  : 'border-white/80 hover:border-pink-300 hover:shadow-md'
              } bg-white/70 backdrop-blur-sm`}>
                {s.img ? (
                  <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {s.icon || '💍'}
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium text-center leading-tight transition-colors ${
                subcatActiva === s.value ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-500'
              }`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)

export default CategoryBanner
