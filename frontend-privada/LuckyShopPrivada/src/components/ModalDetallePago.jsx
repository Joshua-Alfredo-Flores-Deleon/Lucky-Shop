import "./PagosModales.css";

export default function ModalDetallePago({ pago, onCerrar, iniciales }) {
  if (!pago) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-panel grande">
        <h2 className="modal-titulo">Detalles de pago</h2>

        <div className="detalle-cuerpo">
          <div className="detalle-avatar-col">
            <div className="detalle-avatar-circulo">{iniciales(pago.cliente)}</div>
            <p className="detalle-avatar-nombre">{pago.cliente}</p>
          </div>

          <div className="detalle-divisor" />

          <div className="detalle-lista">
            <Fila icono={<IconoDinero />} etiqueta="Monto" valor={`$${pago.monto.toFixed(2)}`} />
            <Fila icono={<IconoBanco />} etiqueta="Método de pago" valor={pago.metodo} />
            <Fila
              icono={<IconoCalendario />}
              etiqueta="Fecha de pago"
              valor={pago.fecha ? new Date(pago.fecha).toLocaleDateString("es-SV") : "—"}
            />
            <Fila
              icono={<IconoCaja />}
              etiqueta="Producto"
              valor={`${pago.producto}${pago.detalleProducto ? `\n${pago.detalleProducto}` : ""}`}
            />
            <Fila icono={<IconoCirculo />} etiqueta="Estado" valor={pago.estado} />
          </div>
        </div>

        <div className="modal-cerrar-solo">
          <button className="modal-boton-primario" style={{ flex: "none", padding: "10px 24px" }} onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Fila({ icono, etiqueta, valor }) {
  return (
    <div className="detalle-fila">
      <span className="detalle-fila-icono">{icono}</span>
      <div>
        <p className="detalle-etiqueta">{etiqueta}</p>
        <p className="detalle-valor">{valor}</p>
      </div>
    </div>
  );
}

function IconoDinero() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconoBanco() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M4 10v11M20 10v11M8 10v11M16 10v11" />
    </svg>
  );
}

function IconoCalendario() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconoCaja() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  );
}

function IconoCirculo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}