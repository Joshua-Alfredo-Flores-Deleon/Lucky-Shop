// Perfil.jsx — página de perfil del administrador (solo lectura: nombre y correo)
import SidebarPerfil from "../components/SideBarPerfil";
import { usePerfil } from "../hooks/usePerfilP";
import "../AdminShell.css";
import "./PerfilPriv.css";

export default function Perfil() {
  // Datos del administrador, obtenidos de la sesión activa (checkSession)
  const { perfil, cargando, error } = usePerfil();

  // Mientras se carga el perfil
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

  // Si falló la carga o no hay datos de perfil
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
        {/* Avatar (foto real, o iniciales del nombre si no hay foto) + nombre y rol */}
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

        {/* Tarjeta con la información de la cuenta (nombre y correo, solo lectura) */}
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

// Genera las iniciales del nombre completo (máximo 2 letras), para usarlas como avatar
// cuando no hay una foto de perfil real
function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}