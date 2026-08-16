export default function ModalExito({ abierto, mensaje, onCerrar }) {
  // Si el modal no está activo, no renderiza nada
  if (!abierto) return null;

  return (
    // Fondo oscuro que cubre la pantalla
    <div className="modal-fondo">
      {/* Contenedor principal de la ventana modal */}
      <div className="modal-panel chico">
        {/* Icono de verificación de éxito */}
        <div className="confirmar-icono" style={{ borderColor: "#3b6d11", color: "#3b6d11" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        {/* Título y mensaje del modal */}
        <div className="confirmar-texto">
          <p className="confirmar-titulo">¡Completado!</p>
          <p className="confirmar-descripcion">{mensaje}</p>
        </div>
        {/* Botón para cerrar la ventana modal */}
        <div className="modal-cerrar-solo" style={{ marginTop: 0 }}>
          <button className="modal-boton-primario" onClick={onCerrar}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}