/**
 * Logo.jsx
 * Componente reutilizable con el logotipo de LuckyShop: "Lucky" en magenta y
 * "sh🍀p" en verde (el trébol reemplaza la "o", igual que en el diseño de
 * Figma). Recibe un `size` opcional para reutilizarlo en distintas pantallas.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const Logo = ({ size = 26, mostrarSubtitulo = true }) => {
  return (
    <View style={styles.contenedor}>
      <Text style={[styles.texto, { fontSize: size }]}>
        <Text style={styles.lucky}>Lucky</Text>
        <Text style={styles.sh}>sh</Text>
        <Text style={styles.trebol}>🍀</Text>
        <Text style={styles.sh}>p</Text>
      </Text>
      {mostrarSubtitulo && <Text style={styles.subtitulo}>BY LESLIE</Text>}
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  contenedor: { alignItems: "center" },
  texto: { fontWeight: "800", letterSpacing: 0.5 },
  lucky: { color: colors.magenta },
  sh: { color: colors.greenLogo },
  trebol: { fontSize: 16 },
  subtitulo: {
    fontSize: 8,
    letterSpacing: 3,
    color: colors.textGray,
    marginTop: 2,
    fontWeight: "600",
  },
});
