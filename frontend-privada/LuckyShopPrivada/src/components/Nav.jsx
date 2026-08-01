import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./Nav.css";

const BASE_URL = "http://localhost:4000/api";

function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}

export default function Nav({ openNotifications }) {
  const navigate = useNavigate();
  const [nombreAdmin, setNombreAdmin] = useState("");

  useEffect(() => {
    let activo = true;
    fetch(`${BASE_URL}/loginAdmin/checkSession`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!activo) return;
        const admin = data.admin;
        if (admin) {
          setNombreAdmin(`${admin.name || ""} ${admin.lastName || ""}`.trim());
        }
      })
      .catch(() => {});
    return () => { activo = false };
  }, []);

  return (
    <nav className="navbar">
      {/* Espacio para empujar los botones hacia la derecha */}
      <div></div>

      <div className="navbar-actions">
        {/* Botón de notificaciones */}
        <button
          className="notification-button"
          onClick={openNotifications}
        >
          <FaBell />
          {/* Indicador de notificaciones */}
          <span className="notification-dot"></span>
        </button>

        {/* Avatar con iniciales del administrador */}
        <div
          className="profile-image profile-image-iniciales"
          onClick={() => navigate("/perfilAdmin")}
          title={nombreAdmin || "Administrador"}
        >
          {iniciales(nombreAdmin)}
        </div>
      </div>
    </nav>
  );
}