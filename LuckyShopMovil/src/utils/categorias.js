/**
 * categorias.js
 * Catálogo de categorías de la tienda. Mapea la etiqueta que ve el usuario con
 * el "slug" real que guarda la base de datos (el mismo que usa la app web), para
 * que los filtros de /api/productos coincidan. El `icon` es un nombre de Ionicons.
 */
export const categorias = [
  { label: "Collares", slug: "collares", icon: "diamond-outline" },
  { label: "Aritos", slug: "pendientes", icon: "ear-outline" },
  { label: "Anillos", slug: "anillos", icon: "ellipse-outline" },
  { label: "Brazaletes", slug: "pulseras", icon: "watch-outline" },
];

export default categorias;