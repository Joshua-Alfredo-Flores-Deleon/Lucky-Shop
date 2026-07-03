import { useNotificaciones } from "../hooksP/useNotificaciones";
import { useNavigate } from "react-router-dom";
import "../NotificationModal.css";

export default function NotificacionesModal({ abierto, onCerrar }) {
  const { notificaciones, cargando, error } = useNotificaciones();
  const navigate = useNavigate();

  const handleClick = (enlace) => {
    if (enlace) {
      navigate(enlace);
      onCerrar();
    }
  };

  if (!abierto) return null;

  return (
    <div className="notif-fondo" onClick={onCerrar}>
      <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="notif-cabecera">
          <h2 className="notif-titulo">Notificaciones</h2>
          {!cargando && !error && notificaciones.length > 0 && (
            <span className="notif-conteo">{notificaciones.length}</span>
          )}
          <button className="notif-cerrar" onClick={onCerrar} aria-label="Cerrar notificaciones">
            <IconoX />
          </button>
        </div>

        {/* Estados de carga / error */}
        {cargando && (
          <div className="notif-cargando">
            <span className="notif-spinner" />
            <p>Cargando notificaciones…</p>
          </div>
        )}
        {error && (
          <p className="notif-estado-error">No se pudieron cargar las notificaciones: {error}</p>
        )}

        {/* Lista de notificaciones */}
        {!cargando && !error && (
          <div className="notif-lista">
            {notificaciones.length === 0 ? (
              <p className="notif-vacio">No tienes notificaciones nuevas.</p>
            ) : (
              notificaciones.map((n) => (
                <div 
                  key={n.id} 
                  className={`notif-item ${n.tipo} ${n.enlace ? "clickable" : ""}`}
                  onClick={() => handleClick(n.enlace)}
                  style={{ cursor: n.enlace ? "pointer" : "default" }}
                >
                  {n.icono && <span className="notif-icono">{n.icono}</span>}
                  <div className="notif-item-contenido">
                    <p className="notif-item-titulo">{n.titulo}</p>
                    <p className="notif-item-descripcion">{n.descripcion}</p>
                    {n.enlace && (
                      <span className="notif-ver-mas" style={{ fontSize: "12px", color: "var(--color-primary-pink)", fontWeight: "600", marginTop: "4px", display: "inline-block" }}>
                        Ver detalles →
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IconoX() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}