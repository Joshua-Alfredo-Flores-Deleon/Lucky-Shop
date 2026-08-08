/**
 * useRecoveryPassword.js
 * Custom hook para el flujo de recuperación de contraseña en tres pasos:
 *   1) solicitarCodigo(email)      -> envía el PIN al correo
 *   2) verificarCodigo(codigo)     -> valida el PIN
 *   3) guardarNuevaPassword(...)   -> actualiza la contraseña
 *
 * El backend encadena estos pasos con un token temporal (recoveryCookie en web).
 * En móvil ese token viaja también en el cuerpo de las respuestas; lo guardamos
 * aquí y lo reenviamos en cada paso siguiente.
 */
import { useState } from "react";
import { endpoints } from "../api/apiConfig";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useRecoveryPassword = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [correoDestino, setCorreoDestino] = useState(""); // para mostrarlo enmascarado en la pantalla del PIN

  // Paso 1: solicitar el código de recuperación.
  const solicitarCodigo = async (email) => {
    setError(null);
    const correo = email?.trim().toLowerCase();

    if (!correo || !emailRegex.test(correo)) {
      const msg = "Ingresa un correo válido";
      setError(msg);
      return { ok: false, message: msg };
    }

    try {
      setCargando(true);
      const res = await fetch(endpoints.recoveryRequestCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message === "user not found"
          ? "No encontramos una cuenta con ese correo"
          : data.message || "No se pudo enviar el código";
        setError(msg);
        return { ok: false, message: msg };
      }

      if (data.recoveryToken) setRecoveryToken(data.recoveryToken);
      setCorreoDestino(correo);
      return { ok: true, message: "Código enviado" };
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: verificar el código (PIN).
  const verificarCodigo = async (codigo) => {
    setError(null);
    try {
      setCargando(true);
      const res = await fetch(endpoints.recoveryVerifyCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codigo, recoveryToken }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.message === "Invalid code") {
        const msg = "El código ingresado no es válido";
        setError(msg);
        return { ok: false, message: msg };
      }

      // El backend renueva el token (ahora marcado como verificado).
      if (data.recoveryToken) setRecoveryToken(data.recoveryToken);
      return { ok: true, message: "Código verificado" };
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  // Paso 3: guardar la nueva contraseña.
  const guardarNuevaPassword = async (newPassword, confirmNewPassword) => {
    setError(null);

    if (!newPassword || newPassword.length < 8) {
      const msg = "La contraseña debe tener al menos 8 caracteres";
      setError(msg);
      return { ok: false, message: msg };
    }
    if (newPassword !== confirmNewPassword) {
      const msg = "Las contraseñas no coinciden";
      setError(msg);
      return { ok: false, message: msg };
    }

    try {
      setCargando(true);
      const res = await fetch(endpoints.recoveryNewPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmNewPassword, recoveryToken }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "No se pudo actualizar la contraseña";
        setError(msg);
        return { ok: false, message: msg };
      }
      return { ok: true, message: "Contraseña actualizada" };
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  return {
    solicitarCodigo,
    verificarCodigo,
    guardarNuevaPassword,
    cargando,
    error,
    setError,
    correoDestino,
  };
};

export default useRecoveryPassword;
