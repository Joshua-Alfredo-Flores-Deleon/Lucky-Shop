/**
 * RecoveryPinScreen.jsx
 * Paso 2 de la recuperación: el usuario ingresa el PIN de verificación que
 * recibió por correo. Muestra el correo de destino enmascarado (a****@gmail.com)
 * tal como en el diseño. Al verificarse, avanza a la pantalla de nueva contraseña.
 */
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Logo from "../../components/Logo";
import CustomButton from "../../components/CustomButton";
import PinInput from "../../components/PinInput";
import Icon from "../../components/Icon";
import Notificacion from "../../components/Notificacion";
import useNotificacion from "../../hooks/useNotificacion";
import { useRecoveryContext } from "../../context/RecoveryContext";
import { colors } from "../../theme/colors";

// Enmascara el correo: "leslie@gmail.com" -> "l********@gmail.com"
const enmascararCorreo = (correo = "") => {
  const [usuario, dominio] = correo.split("@");
  if (!dominio) return correo;
  const visible = usuario.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(usuario.length - 1, 3))}@${dominio}`;
};

const RecoveryPinScreen = ({ navigation }) => {
  const [codigo, setCodigo] = useState("");
  const { verificarCodigo, solicitarCodigo, correoDestino, cargando } = useRecoveryContext();
  const { notificacion, mostrar, ocultar } = useNotificacion();

  const manejarConfirmar = async () => {
    if (codigo.length < 6) {
      mostrar("Ingresa el código completo", "error");
      return;
    }
    const resultado = await verificarCodigo(codigo);
    if (resultado.ok) {
      mostrar("Código verificado", "success");
      setTimeout(() => navigation.navigate("RecoveryNewPassword"), 500);
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

      <View style={styles.centro}>
        <View style={styles.tarjeta}>
          <View style={styles.iconoCirculo}>
            <Icon name="shield-checkmark" size={26} color={colors.greenLogo} />
          </View>

          <Text style={styles.titulo}>PIN de verificación</Text>
          <Text style={styles.descripcion}>
            Código de seguridad enviado a la dirección{" "}
            <Text style={styles.correo}>{enmascararCorreo(correoDestino)}</Text>
          </Text>

          <PinInput value={codigo} onChange={setCodigo} />

          <View style={{ height: 16 }} />
          <CustomButton title="Confirmar" variant="wine" onPress={manejarConfirmar} loading={cargando} />

          <View style={styles.reenviar}>
            <Text style={styles.reenviarTexto}>¿No recibiste el código?</Text>
            <TouchableOpacity onPress={() => solicitarCodigo(correoDestino)}>
              <Text style={styles.reenviarLink}> Reenviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecoveryPinScreen;

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
  tarjeta: { backgroundColor: colors.white, borderRadius: 28, padding: 26, alignItems: "center" },
  iconoCirculo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icono: { fontSize: 24 },
  titulo: { fontSize: 20, fontWeight: "800", color: colors.greenLogo, textAlign: "center", marginBottom: 10 },
  descripcion: {
    fontSize: 13,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  correo: { color: colors.textDark, fontWeight: "700" },
  reenviar: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  reenviarTexto: { color: colors.textGray, fontSize: 13 },
  reenviarLink: { color: colors.wine, fontSize: 13, fontWeight: "800", textDecorationLine: "underline" },
});