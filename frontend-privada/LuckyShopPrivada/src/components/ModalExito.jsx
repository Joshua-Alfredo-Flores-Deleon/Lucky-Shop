

export default function ModalExito({ abierto, mensaje, onCerrar }) {
  if (!abierto) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-panel chico">
        <div className="confirmar-icono" style={{ borderColor: "#3b6d11", color: "#3b6d11" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="confirmar-texto">
          <p className="confirmar-titulo">¡Completado!</p>
          <p className="confirmar-descripcion">{mensaje}</p>
        </div>
        <div className="modal-cerrar-solo" style={{ marginTop: 0 }}>
          <button className="modal-boton-primario" onClick={onCerrar}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
