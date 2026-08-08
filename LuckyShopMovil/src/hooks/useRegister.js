/**
 * useRegister.js
 * Custom hook para el registro de clientes en dos pasos:
 *   1) registrar(): envía los datos y dispara el correo con el código.
 *   2) verificarCodigo(): confirma el código que llegó al correo y crea la cuenta.
 *
 * El backend guarda los datos temporales del registro en un token (originalmente
 * en cookie). Para móvil ese token también viaja en el cuerpo de la respuesta;
 * lo conservamos aquí y lo reenviamos en el paso de verificación.
 */
import { useState } from "react";
import { endpoints } from "../api/apiConfig";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useRegister = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  // Token temporal que devuelve el backend tras el primer paso.
  const [registrationToken, setRegistrationToken] = useState(null);

  /**
   * registrar({ nombreCompleto, email, password })
   * Divide el nombre completo en nombre y apellido, valida y llama al backend.
   */
  const registrar = async ({ nombreCompleto, email, password }) => {
    setError(null);

    const correo = email?.trim().toLowerCase();
    const nombre = nombreCompleto?.trim();

    if (!nombre || !correo || !password) {
      const msg = "Completa todos los campos";
      setError(msg);
      return { ok: false, message: msg };
    }
    if (!emailRegex.test(correo)) {
      const msg = "El correo no tiene un formato válido";
      setError(msg);
      return { ok: false, message: msg };
    }
    if (password.length < 8) {
      const msg = "La contraseña debe tener al menos 8 caracteres";
      setError(msg);
      return { ok: false, message: msg };
    }

    // "Alex Fortune" -> name: "Alex", lastName: "Fortune"
    const partes = nombre.split(" ");
    const name = partes.shift();
    const lastName = partes.join(" ");

    try {
      setCargando(true);
      const res = await fetch(endpoints.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastName, email: correo, password, isVerified: false }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message === "Client already exist"
          ? "Ya existe una cuenta con ese correo"
          : data.message || "No se pudo registrar";
        setError(msg);
        return { ok: false, message: msg };
      }

      if (data.registrationToken) setRegistrationToken(data.registrationToken);
      return { ok: true, message: "Código enviado a tu correo" };
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  /**
   * verificarCodigo(codigo)
   * Envía el código de 6 caracteres para crear la cuenta definitivamente.
   */
  const verificarCodigo = async (codigo) => {
    setError(null);
    try {
      setCargando(true);
      const res = await fetch(endpoints.verifyRegister, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationCodeRequest: codigo,
          registrationToken, // respaldo para móvil (sin cookies)
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.message === "Invalid code") {
        const msg = "El código ingresado no es válido";
        setError(msg);
        return { ok: false, message: msg };
      }
      return { ok: true, message: "Cuenta creada correctamente" };
    } catch (e) {
      const msg = "No se pudo conectar con el servidor";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setCargando(false);
    }
  };

  return { registrar, verificarCodigo, cargando, error, setError };
};

export default useRegister;
