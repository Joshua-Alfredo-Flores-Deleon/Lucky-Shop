/**
 * useLogin.js
 * Custom hook que encapsula la lógica de la pantalla de inicio de sesión:
 * valida el formulario, llama al AuthContext y expone el estado de carga y los
 * mensajes de error/éxito para que la pantalla solo se preocupe por la UI.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Expresión regular simple para validar el formato del correo.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLogin = () => {
  const { iniciarSesion } = useAuth();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * login(email, password)
   * Valida los campos y ejecuta el inicio de sesión.
   * @returns {Promise<{ok:boolean, message:string}>}
   */
  const login = async (email, password) => {
    setError(null);

    const correo = email?.trim().toLowerCase();

    if (!correo || !password) {
      const msg = "Ingresa tu correo y contraseña";
      setError(msg);
      return { ok: false, message: msg };
    }

    if (!emailRegex.test(correo)) {
      const msg = "El correo no tiene un formato válido";
      setError(msg);
      return { ok: false, message: msg };
    }

    try {
      setCargando(true);
      const resultado = await iniciarSesion(correo, password);
      if (!resultado.ok) setError(resultado.message);
      return resultado;
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  return { login, cargando, error, setError };
};

export default useLogin;
