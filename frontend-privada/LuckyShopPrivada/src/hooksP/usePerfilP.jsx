import { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:4000/api/registerAdmin";

// Normaliza el admin que devuelve el backend (adminModel: name, lastName,
// email, ...) a la forma que usa la UI de Perfil. "telefono" no está en el
// schema fijo pero se guarda igual gracias a `strict: false`. "rol" no
// existe en la base de datos (todos son "Admin" por el token), así que
// queda fijo aquí.
function normalizarAdmin(admin) {
  return {
    id: admin._id ?? admin.id,
    nombre: admin.name ?? "",
    apellido: admin.lastName ?? "",
    nombreCompleto: [admin.name, admin.lastName].filter(Boolean).join(" "),
    rol: "Administrador",
    correo: admin.email ?? "",
    telefono: admin.telefono ?? "",
  };
}

/**
 * Hook central de la sección Perfil.
 * Trae los datos del administrador logueado (vía cookie authCookie) y administra el modo edición.
 */
export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [borrador, setBorrador] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Carga el perfil del administrador autenticado (el backend lo identifica por la cookie)
  useEffect(() => {
    let activo = true;

    async function cargarPerfil() {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}`, {
          method: "GET",
          credentials: "include", // manda la cookie authCookie
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "No se pudo cargar el perfil");
        }

        if (!activo) return;
        const admin = Array.isArray(data) ? data[0] : data.data ?? data;
        setPerfil(normalizarAdmin(admin));
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPerfil();
    return () => {
      activo = false;
    };
  }, []);

  // Cada vez que se entra en modo edición, el borrador parte de los datos guardados
  useEffect(() => {
    if (editando && perfil) setBorrador(perfil);
  }, [editando, perfil]);

  const iniciarEdicion = useCallback(() => setEditando(true), []);
  const cancelarEdicion = useCallback(() => setEditando(false), []);

  const actualizarCampo = useCallback((campo, valor) => {
    setBorrador((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const guardarPerfil = useCallback(async () => {
    if (!borrador) return;
    setGuardando(true);
    setError(null);
    try {
      // Solo se mandan los campos editables: nombre, apellido, teléfono.
      // El correo no se toca desde aquí.
      const res = await fetch(`${BASE_URL}/${borrador.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: borrador.nombre,
          lastName: borrador.apellido,
          telefono: borrador.telefono,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo guardar el perfil");
      }

      setPerfil(normalizarAdmin(data));
      setEditando(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }, [borrador]);

  return {
    perfil,
    borrador,
    editando,
    cargando,
    error,
    guardando,
    iniciarEdicion,
    cancelarEdicion,
    actualizarCampo,
    guardarPerfil,
  };
}