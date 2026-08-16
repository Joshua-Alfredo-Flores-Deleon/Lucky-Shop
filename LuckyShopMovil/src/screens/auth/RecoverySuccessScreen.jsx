/**
 * RecoverySuccessScreen.jsx
 * Pantalla final del flujo de recuperación: confirma que la contraseña se
 * actualizó con éxito. El botón "Aceptar" devuelve al usuario al login.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Logo from "../../components/Logo";
import CustomButton from "../../components/CustomButton";
import Icon from "../../components/Icon";
import { colors } from "../../theme/colors";

const RecoverySuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.pantalla}>
      <View style={styles.header}>
        <Logo size={20} mostrarSubtitulo={false} />
      </View>

      <View style={styles.centro}>
        <View style={styles.tarjeta}>
          <View style={styles.iconoCirculo}>
            <Icon name="checkmark" size={36} color={colors.white} />
          </View>

          <Text style={styles.titulo}>Contraseña actualizada con éxito!</Text>
          <Text style={styles.descripcion}>
            Tu cuenta está protegida. Ahora puedes seguir explorando las últimas
            tendencias en joyería con tu nueva contraseña.
          </Text>

          <CustomButton
            title="Aceptar"
            variant="wine"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </View>
    </View>
  );
};

export default RecoverySuccessScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.greenBg },
  header: {
    alignItems: "center",
    paddingTop: 54,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  centro: { flex: 1, justifyContent: "center", padding: 20 },
  tarjeta: { backgroundColor: colors.white, borderRadius: 28, padding: 28, alignItems: "center" },
  iconoCirculo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.greenLogo,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  icono: { fontSize: 34, color: colors.white, fontWeight: "800" },
  titulo: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.greenLogo,
    textAlign: "center",
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 13,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
  },
});