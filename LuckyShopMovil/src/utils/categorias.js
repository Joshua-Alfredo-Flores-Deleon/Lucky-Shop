/**
 * categorias.js
 * Catálogo de categorías de la tienda. Mapea la etiqueta que ve el usuario con
 * el "slug" real que guarda la base de datos (el mismo que usa la app web), para
 * que los filtros de /api/productos coincidan.
 */
export const categorias = [
  { label: "Collares", slug: "collares", icon: "📿" },
  { label: "Aritos", slug: "pendientes", icon: "🦻" },
  { label: "Anillos", slug: "anillos", icon: "💍" },
  { label: "Brazaletes", slug: "pulseras", icon: "🔗" },
];

export default categorias;
