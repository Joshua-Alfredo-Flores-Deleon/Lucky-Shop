/**
 * CustomButton.jsx
 * Botón reutilizable de la aplicación. Admite variantes de color para cubrir los
 * distintos estilos del diseño (verde oscuro en auth, vino en recuperación) y un
 * estado de carga que muestra un spinner y bloquea el botón.
 *
 * Props:
 *  - title:     texto del botón
 *  - onPress:   función a ejecutar al presionar
 *  - variant:   "darkGreen" | "wine" | "pink" | "outline"  (default: darkGreen)
 *  - loading:   muestra spinner y deshabilita el botón
 *  - disabled:  deshabilita el botón
 *  - icon:      nombre de icono Ionicons opcional al final del título (ej: "arrow-forward")
 */
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";

const CustomButton = ({
  title,
  onPress,
  variant = "darkGreen",
  loading = false,
  disabled = false,
  icon,
}) => {
  const estiloVariante = variantes[variant] || variantes.darkGreen;
  const inactivo = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.boton, estiloVariante.boton, inactivo && styles.inactivo]}
      onPress={onPress}
      disabled={inactivo}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={estiloVariante.texto.color} />
      ) : (
        <View style={styles.fila}>
          <Text style={[styles.texto, estiloVariante.texto]}>{title}</Text>
          {icon ? (
            <Icon name={icon} size={18} color={estiloVariante.texto.color} style={styles.icono} />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

// Estilos por variante para no repetir TouchableOpacity en cada pantalla.
const variantes = {
  darkGreen: {
    boton: { backgroundColor: colors.darkGreen },
    texto: { color: colors.white },
  },
  wine: {
    boton: { backgroundColor: colors.wine },
    texto: { color: colors.white },
  },
  pink: {
    boton: { backgroundColor: colors.magenta },
    texto: { color: colors.white },
  },
  outline: {
    boton: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.darkGreen },
    texto: { color: colors.darkGreen },
  },
};

const styles = StyleSheet.create({
  boton: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inactivo: { opacity: 0.6 },
  fila: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "700" },
  icono: { marginLeft: 8 },
});