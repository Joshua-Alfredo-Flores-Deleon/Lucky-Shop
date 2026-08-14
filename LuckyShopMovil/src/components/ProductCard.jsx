/**
 * ProductCard.jsx
 * Tarjeta reutilizable para mostrar un producto (usada en Home y Categorías).
 * Muestra la imagen de presentación, la categoría, el nombre y el precio, más
 * un botón de favorito (corazón) que cambia de estado visual al presionarlo.
 *
 * Props:
 *  - producto:    objeto con { nombre, precio, imagenPresentacion, idCategoria }
 *  - onPress:     acción al tocar la tarjeta (ver detalle)
 *  - esFavorito:  si el corazón aparece marcado
 *  - onToggleFav: acción del corazón
 */
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";

const ProductCard = ({ producto, onPress, esFavorito = false, onToggleFav }) => {
  // Imagen: usamos la de presentación o la primera del arreglo; si no hay,
  // dejamos un color de fondo para no romper el diseño.
  const uri = producto?.imagenPresentacion || producto?.imagenes?.[0] || null;
  const precio = Number(producto?.precio || 0).toFixed(2);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imagenContenedor}>
        {uri ? (
          <Image source={{ uri }} style={styles.imagen} resizeMode="cover" />
        ) : (
          <View style={[styles.imagen, styles.imagenVacia]} />
        )}
        <TouchableOpacity style={styles.favBtn} onPress={onToggleFav} hitSlop={8}>
          <Icon
            name={esFavorito ? "heart" : "heart-outline"}
            size={16}
            color={esFavorito ? colors.magenta : colors.textGray}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.categoria}>
        {(producto?.idCategoria || "Producto").toUpperCase()}
      </Text>
      <Text style={styles.nombre} numberOfLines={1}>
        {producto?.nombre}
      </Text>
      <Text style={styles.precio}>${precio}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: { width: "48%", marginBottom: 18 },
  imagenContenedor: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surface,
    position: "relative",
  },
  imagen: { width: "100%", height: 150 },
  imagenVacia: { backgroundColor: colors.pinkSoft },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  categoria: {
    fontSize: 10,
    color: colors.textGray,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  nombre: { fontSize: 14, fontWeight: "700", color: colors.textDark, marginTop: 2 },
  precio: { fontSize: 14, fontWeight: "800", color: colors.greenLogo, marginTop: 2 },
});