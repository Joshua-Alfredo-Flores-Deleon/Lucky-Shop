const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // Si el modal no está activo, no renderiza nada
  if (!isOpen) return null

  return (
    // Fondo oscuro que cubre toda la pantalla y cierra el modal al hacer clic afuera
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      {/* Contenedor principal de la ventana modal */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        {/* Espacio para icono decorativo */}
        <div className="text-4xl mb-3"></div>
        {/* Título de la confirmación */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {/* Mensaje o descripción detallada */}
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        {/* Botones de acción */}
        <div className="flex gap-3 justify-center">
          {/* Botón para cancelar y cerrar el modal */}
          <button
            onClick={onCancel}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          {/* Botón para confirmar la acción de eliminación */}
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal