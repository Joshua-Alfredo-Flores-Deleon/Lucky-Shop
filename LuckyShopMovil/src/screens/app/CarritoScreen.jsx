/**
 * CarritoScreen.jsx
 * Pantalla del carrito. Para el avance del 80% se presenta la estructura y el
 * estado vacío (la lógica completa de compra corresponde a etapas posteriores).
 * Mantiene la coherencia visual y la navegabilidad requerida por la rúbrica.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import { colors } from "../../theme/colors";

const CarritoScreen = () => {
  return (
    <View style={styles.pantalla}>
      <View style={styles.header}>
        <Logo size={22} mostrarSubtitulo={false} />
      </View>

      <Text style={styles.titulo}>Tu carrito</Text>

      <View style={styles.centro}>
        <Icon name="cart-outline" size={54} color={colors.textLight} />
        <Text style={styles.vacioTitulo}>Tu carrito está vacío</Text>
        <Text style={styles.vacioTexto}>
          Explora la tienda y agrega tus piezas de la suerte favoritas.
        </Text>
      </View>
    </View>
  );
};

export default CarritoScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.white },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 6 },
  titulo: { fontSize: 24, fontWeight: "800", color: colors.textDark, paddingHorizontal: 20, marginTop: 6 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  vacioTitulo: { fontSize: 18, fontWeight: "800", color: colors.textDark, marginBottom: 8, marginTop: 16 },
  vacioTexto: { fontSize: 14, color: colors.textGray, textAlign: "center", lineHeight: 20 },
});