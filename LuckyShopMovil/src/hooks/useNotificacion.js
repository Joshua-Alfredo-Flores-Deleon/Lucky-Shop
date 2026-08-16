/**
 * useNotificacion.js
 * Custom hook que administra el estado del banner <Notificacion />. Evita repetir
 * en cada pantalla los tres estados (visible, tipo, mensaje) y expone una única
 * función `mostrar(mensaje, tipo)` para lanzar avisos.
 */
import { useState, useCallback } from "react";

export const useNotificacion = () => {
  const [estado, setEstado] = useState({ visible: false, tipo: "info", mensaje: "" });

  // Muestra un aviso. tipo: "success" | "error" | "info".
  const mostrar = useCallback((mensaje, tipo = "info") => {
    setEstado({ visible: true, tipo, mensaje });
  }, []);

  // Oculta el aviso (lo llama el propio banner al terminar su animación).
  const ocultar = useCallback(() => {
    setEstado((prev) => ({ ...prev, visible: false }));
  }, []);

  return { notificacion: estado, mostrar, ocultar };
};

export default useNotificacion;
