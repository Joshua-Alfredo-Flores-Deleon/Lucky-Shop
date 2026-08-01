import SidebarPerfil from "../components/sideBarPerfil";
import { usePerfil } from "../hooksP/usePerfilP";
import "../AdminShell.css";
import "./PerfilPriv.css";

export default function Perfil() {
  const { perfil, cargando, error } = usePerfil();

  if (cargando) {
    return (
      <div className="admin-shell">
        <SidebarPerfil />
        <main className="admin-main">
          <p className="perfil-estado">Cargando perfil…</p>
        </main>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="admin-shell">
        <SidebarPerfil />
        <main className="admin-main">
          <p className="perfil-estado-error">No se pudo cargar el perfil{error ? `: ${error}` : "."}</p>
        </main>
      </div>
    );
  }

  const nombreMostrado = perfil.nombreCompleto || perfil.nombre;

  return (
    <div className="admin-shell">
      <SidebarPerfil />
      <main className="admin-main">
        <div className="perfil-pagina">
      <div className="perfil-banner" />

      <div className="perfil-contenido">
        <div className="perfil-fila-avatar">
          {perfil.avatarUrl ? (
            <img src={perfil.avatarUrl} alt={`Foto de perfil de ${nombreMostrado}`} className="perfil-avatar" />
          ) : (
            <div className="perfil-avatar perfil-avatar-iniciales">
              {iniciales(nombreMostrado)}
            </div>
          )}
          <div style={{ paddingBottom: 4 }}>
            <p className="perfil-nombre">{nombreMostrado}</p>
            <p className="perfil-rol">{perfil.rol}</p>
          </div>
        </div>

        <div className="perfil-grid">
          <div className="perfil-tarjeta">
            <p className="perfil-titulo-tarjeta">Información de cuenta</p>

            <div className="perfil-info-grid">
              <div>
                <p className="perfil-etiqueta">Nombre</p>
                <p className="perfil-valor">{perfil.nombreCompleto}</p>
              </div>
              <div>
                <p className="perfil-etiqueta">Correo</p>
                <p className="perfil-valor">{perfil.correo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}

function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}