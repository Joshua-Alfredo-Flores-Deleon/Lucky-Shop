/**
 * Logo.jsx
 * Componente reutilizable con el logotipo de LuckyShop. Usa la imagen del
 * wordmark ("Luckysh🍀p") para verse idéntico en todos los dispositivos,
 * evitando depender de emojis. El `size` controla la altura del logo.
 */
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

// La imagen del wordmark tiene proporción ~3.83:1 (ancho:alto).
const RELACION_ASPECTO = 3.83;

const Logo = ({ size = 26, mostrarSubtitulo = true }) => {
  // `size` se interpreta como la altura aproximada del texto del logo.
  const alto = size * 1.15;
  const ancho = alto * RELACION_ASPECTO;

  return (
    <View style={styles.contenedor}>
      <Image
        source={require("../../assets/logo-wordmark.png")}
        style={{ width: ancho, height: alto, resizeMode: "contain" }}
      />
      {mostrarSubtitulo && <Text style={styles.subtitulo}>BY LESLIE</Text>}
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  contenedor: { alignItems: "center" },
  subtitulo: {
    fontSize: 8,
    letterSpacing: 3,
    color: colors.textGray,
    marginTop: 2,
    fontWeight: "600",
  },
});