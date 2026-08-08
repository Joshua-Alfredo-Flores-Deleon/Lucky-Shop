/**
 * Loader.jsx
 * Indicador de carga reutilizable (spinner) con un texto opcional. Se usa
 * mientras se traen datos desde el backend.
 */
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const Loader = ({ texto = "Cargando...", color = colors.magenta }) => {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color={color} />
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  texto: { marginTop: 12, color: colors.textGray, fontSize: 14 },
});
