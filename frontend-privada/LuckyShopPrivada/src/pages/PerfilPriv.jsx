import { useState } from "react";
import Sidebar from "../components/sideBar";
import Nav from "../components/Nav";
import NotificacionesModal from "../components/NotificationsModal";
import { usePerfil } from "../hooksP/usePerfilP";
import "./PerfilPriv.css";


export default function Perfil() {
  const { perfil, borrador, editando, cargando, error, guardando, iniciarEdicion, cancelarEdicion, actualizarCampo, guardarPerfil } =
    usePerfil();

  if (cargando) {
    return <p className="perfil-estado">Cargando perfil…</p>;
  }

  if (error || !perfil) {
    return <p className="perfil-estado-error">No se pudo cargar el perfil{error ? `: ${error}` : "."}</p>;
  }

  const nombreMostrado = perfil.nombreCompleto || perfil.nombre;

  return (
    <div className="perfil-pagina">
      <div className="perfil-banner" />

      <div className="perfil-contenido">
        <div className="perfil-fila-avatar">
          {perfil.avatarUrl ? (
            <img src={perfil.avatarUrl} alt={`Foto de perfil de ${nombreMostrado}`} className="perfil-avatar" />
          ) : (
            <div className="perfil-avatar" />
          )}
          <div style={{ paddingBottom: 4 }}>
            <p className="perfil-nombre">{nombreMostrado}</p>
            <p className="perfil-rol">{perfil.rol}</p>
          </div>
        </div>

        <div className="perfil-grid">
          <div>
            <button className="perfil-boton-editar" onClick={iniciarEdicion}>
              Editar perfil
            </button>
          </div>

          <div className="perfil-tarjeta">
            <p className="perfil-titulo-tarjeta">Información de cuenta</p>

            {!editando || !borrador ? (
              <div className="perfil-info-grid">
                <div>
                  <p className="perfil-etiqueta">Nombre</p>
                  <p className="perfil-valor">{perfil.nombreCompleto}</p>
                </div>
                <div>
                  <p className="perfil-etiqueta">Correo</p>
                  <p className="perfil-valor">{perfil.correo}</p>
                </div>
                <div>
                  <p className="perfil-etiqueta">Teléfono</p>
                  <p className="perfil-valor">{perfil.telefono}</p>
                </div>
              </div>
            ) : (
              <div className="perfil-info-grid">
                <Campo label="Nombre" value={borrador.nombre} onChange={(v) => actualizarCampo("nombre", v)} />
                <Campo label="Apellido" value={borrador.apellido} onChange={(v) => actualizarCampo("apellido", v)} />
                <Campo label="Teléfono" value={borrador.telefono} onChange={(v) => actualizarCampo("telefono", v)} />
                <div>
                  <p className="perfil-etiqueta">Correo</p>
                  <p className="perfil-valor">{borrador.correo}</p>
                </div>
                <div className="perfil-acciones-form">
                  <button className="perfil-boton-guardar" onClick={guardarPerfil} disabled={guardando}>
                    {guardando ? "Guardando…" : "Guardar"}
                  </button>
                  <button className="perfil-boton-cancelar" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <span className="perfil-campo-label">{label}</span>
      <input className="perfil-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}