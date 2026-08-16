/**
 * colors.js
 * Paleta central de LuckyShop. Todos los colores fueron extraídos directamente
 * de los diseños de Figma para que la app móvil sea idéntica a la marca.
 * Usar SIEMPRE estas constantes en lugar de escribir hexadecimales sueltos,
 * así se mantiene la coherencia visual en toda la aplicación.
 */
export const colors = {
  // Marca
  magenta: "#FF63C1", // "Lucky" del logo y acentos rosados fuertes
  pink: "#EC4899", // rosa principal para enlaces y botones secundarios
  coral: "#FF94A1", // rosa coral de las tarjetas de categoría
  pinkSoft: "#FCDADF", // fondo suave (barra de búsqueda, chips)
  pinkTint: "#FFE0EF", // rosa muy claro para fondos

  greenLogo: "#3FA84F", // verde del logo ("shop") y del trébol
  greenBrand: "#5AAB5A", // verde marca general
  darkGreen: "#0F420B", // botones oscuros de Registro / Iniciar sesión
  greenBg: "#56AB67", // fondo verde de las pantallas de recuperación
  greenSoft: "#E1F0DE", // verde muy claro (chips, tarjetas)
  greenChip: "#7FAC7D", // verde medio de algunos chips

  wine: "#9C3F53", // botones vino de las pantallas de recuperación

  // Neutros
  white: "#FFFFFF",
  background: "#FFFFFF",
  surface: "#F5F5F4", // gris claro de inputs
  border: "#E5E7EB",
  textDark: "#1C1B1B",
  textGray: "#6B7280",
  textLight: "#9CA3AF",
  danger: "#DC2626",
  success: "#16A34A",
};

export default colors;
