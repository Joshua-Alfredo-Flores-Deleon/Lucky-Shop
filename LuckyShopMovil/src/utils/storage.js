/**
 * storage.js
 * Pequeña capa sobre AsyncStorage para guardar de forma persistente el token
 * de sesión y los datos del cliente. Se centraliza aquí para no repetir las
 * claves (keys) por toda la app y evitar errores de tipeo.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@luckyshop_token";
const USER_KEY = "@luckyshop_user";

// Guarda el token JWT del cliente autenticado.
export const guardarToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log("Error guardando token:", error);
  }
};

// Devuelve el token guardado (o null si no hay sesión).
export const obtenerToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.log("Error obteniendo token:", error);
    return null;
  }
};

// Guarda los datos básicos del cliente (nombre, correo, id...).
export const guardarUsuario = async (usuario) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  } catch (error) {
    console.log("Error guardando usuario:", error);
  }
};

// Recupera los datos del cliente guardados.
export const obtenerUsuario = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log("Error obteniendo usuario:", error);
    return null;
  }
};

// Borra token y usuario (se usa al cerrar sesión).
export const limpiarSesion = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.log("Error limpiando sesión:", error);
  }
};
