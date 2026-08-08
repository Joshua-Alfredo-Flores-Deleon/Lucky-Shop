/**
 * CategoryChip.jsx
 * Chip/tarjeta cuadrada de categoría que aparece en el carrusel superior del
 * Home y de Categorías. Alterna colores rosa/verde (según el índice) tal como
 * en el diseño, muestra un ícono y la etiqueta de la categoría.
 *
 * Props:
 *  - label:  nombre de la categoría (Collares, Aritos, Anillos, Brazaletes)
 *  - icon:   emoji representativo
 *  - index:  posición para alternar el color de fondo
 *  - onPress: acción al seleccionar la categoría
 */
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const CategoryChip = ({ label, icon, index = 0, onPress }) => {
  const fondoPar = index % 2 === 0;
  const colorFondo = fondoPar ? colors.coral : colors.greenChip;

  return (
    <TouchableOpacity style={styles.contenedor} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cuadro, { backgroundColor: colorFondo }]}>
        <Text style={styles.icono}>{icon}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  contenedor: { alignItems: "center", marginRight: 16, width: 68 },
  cuadro: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  icono: { fontSize: 26 },
  label: { fontSize: 12, color: colors.textDark, marginTop: 6, fontWeight: "600" },
});
