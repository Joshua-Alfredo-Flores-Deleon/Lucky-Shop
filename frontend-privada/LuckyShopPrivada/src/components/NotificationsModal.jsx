import { useNotificaciones } from "../hooksP/useNotificaciones";
import "./NotificationModal.css";

export default function NotificacionesModal({ abierto, onCerrar }) {
  const { notificaciones, cargando, error } = useNotificaciones();

  if (!abierto) return null;

  return (
    <div className="notif-fondo" onClick={onCerrar}>
      <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
        <button className="notif-cerrar" onClick={onCerrar} aria-label="Cerrar notificaciones">
          <IconoX />
        </button>

        <h2 className="notif-titulo">Notificaciones</h2>

        {cargando && <p className="notif-vacio">Cargando notificaciones…</p>}
        {error && <p className="notif-estado-error">No se pudieron cargar las notificaciones: {error}</p>}

        {!cargando && !error && (
          <div className="notif-lista">
            {notificaciones.length === 0 ? (
              <p className="notif-vacio">No tienes notificaciones nuevas.</p>
            ) : (
              notificaciones.map((n) => (
                <div key={n.id} className={`notif-item ${n.tipo}`}>
                  <p className="notif-item-titulo">{n.titulo}</p>
                  <p className="notif-item-descripcion">{n.descripcion}</p>
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}