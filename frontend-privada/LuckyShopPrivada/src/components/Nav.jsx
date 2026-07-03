import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import fotoperfilPriv from "../assets/perfilPriv.png"
//import "./Nav.css";

export default function Nav({ openNotifications }) {

  const navigate = useNavigate();

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

        {/* Imagen del administrador */}
        <img
          src={fotoperfilPriv}
          alt="Administrador"
          className="profile-image"
          onClick={() => navigate("/perfilAdmin")}
        />

      </div>

    </nav>

  );
}