/**
 * SocialButton.jsx
 * Botón reutilizable para las opciones "Continúa con Google / Apple" que aparecen
 * en Login y Registro. Es visual (la integración OAuth queda para etapas
 * posteriores del proyecto); muestra el logo y la etiqueta.
 *
 * Props:
 *  - proveedor: "google" | "apple"
 *  - onPress:   acción al presionar
 */
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";

const SocialButton = ({ proveedor = "google", onPress }) => {
  const esApple = proveedor === "apple";
  return (
    <TouchableOpacity
      style={[styles.boton, esApple ? styles.apple : styles.google]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Icon
        name={esApple ? "logo-apple" : "logo-google"}
        size={18}
        color={esApple ? colors.white : colors.textDark}
        style={styles.icono}
      />
      <Text style={[styles.texto, esApple && styles.textoApple]}>
        {esApple ? "Apple" : "Google"}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 14,
  },
  google: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  apple: { backgroundColor: "#111111" },
  icono: { marginRight: 8 },
  texto: { fontSize: 15, fontWeight: "700", color: colors.textDark },
  textoApple: { color: colors.white },
});