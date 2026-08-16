/**
 * RecoveryNewPasswordScreen.jsx
 * Paso 3 de la recuperación: el usuario define su nueva contraseña y la confirma.
 * Al guardarse correctamente, navega a la pantalla de éxito.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Logo from "../../components/Logo";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import Notificacion from "../../components/Notificacion";
import Icon from "../../components/Icon";
import useNotificacion from "../../hooks/useNotificacion";
import { useRecoveryContext } from "../../context/RecoveryContext";
import { colors } from "../../theme/colors";

const RecoveryNewPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const { guardarNuevaPassword, cargando } = useRecoveryContext();
  const { notificacion, mostrar, ocultar } = useNotificacion();

  const manejarGuardar = async () => {
    const resultado = await guardarNuevaPassword(password, confirmar);
    if (resultado.ok) {
      navigation.navigate("RecoverySuccess");
    } else {
      mostrar(resultado.message, "error");
    }
  };

  return (
    <View style={styles.pantalla}>
      <Notificacion {...notificacion} onHide={ocultar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="arrow-back" size={22} color={colors.greenLogo} />
        </TouchableOpacity>
        <Logo size={20} mostrarSubtitulo={false} />
        <View style={{ width: 20 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.centro}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Nueva Contraseña</Text>
          <Text style={styles.descripcion}>
            Crea una contraseña nueva que sea fácil de recordar pero difícil de
            adivinar. Te recomendamos usar una combinación de letras y números.
          </Text>

          <CustomInput
            label="Nueva contraseña"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secure
          />
          <CustomInput
            label="Confirmar contraseña"
            icon="refresh-outline"
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="••••••••"
            secure
          />

          <CustomButton title="Guardar" variant="wine" onPress={manejarGuardar} loading={cargando} />

          <TouchableOpacity style={styles.ayuda}>
            <Text style={styles.ayudaTexto}>¿Necesitas ayuda técnica?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RecoveryNewPasswordScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.greenBg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  volver: { fontSize: 22, color: colors.greenLogo, fontWeight: "700" },
  centro: { flex: 1, justifyContent: "center", padding: 20 },
  tarjeta: { backgroundColor: colors.white, borderRadius: 28, padding: 26 },
  titulo: { fontSize: 20, fontWeight: "800", color: colors.textDark, textAlign: "center", marginBottom: 10 },
  descripcion: {
    fontSize: 13,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  ayuda: { alignItems: "center", marginTop: 18 },
  ayudaTexto: { color: colors.wine, fontSize: 13, fontWeight: "700" },
});