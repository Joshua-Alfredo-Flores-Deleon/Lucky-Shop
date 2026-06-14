const CategoryBanner = ({ titulo, descripcion, subcategorias = [], onSubcat, subcatActiva }) => (
  <div
    className="relative overflow-hidden rounded-none"
    style={{
      background: 'linear-gradient(135deg, #ffd6e8 0%, #ffe0ef 40%, #fff0f6 100%)',
      minHeight: '180px',
    }}
  >
    {/* Círculos decorativos de fondo */}
    <div className="absolute right-8 top-4 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
    <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-pink-300/20 blur-xl" />

    <div className="container mx-auto px-6 py-8 flex items-center justify-between gap-6 relative z-10">
      {/* Texto */}
      <div className="max-w-xs">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-2">{titulo}</h1>
        <p className="text-xs text-gray-600 leading-relaxed">{descripcion}</p>
      </div>

      {/* Subcategorías */}
      {subcategorias.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-end">
          {subcategorias.map((s) => (
            <button
              key={s.value}
              onClick={() => onSubcat?.(s.value === subcatActiva ? '' : s.value)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                subcatActiva === s.value ? 'border-pink-500 shadow-md' : 'border-white/80 hover:border-pink-300'
              } bg-white/60`}>
                {s.img ? (
                  <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{s.icon || '💍'}</div>
                )}
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                subcatActiva === s.value ? 'text-pink-600' : 'text-gray-700'
              }`}>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)

export default CategoryBanner
