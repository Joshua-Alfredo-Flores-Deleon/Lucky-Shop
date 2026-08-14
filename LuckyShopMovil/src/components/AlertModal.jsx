/**
 * AlertModal.jsx
 * Modal centrado reutilizable para confirmar acciones o mostrar resultados
 * (por ejemplo la pantalla "Contraseña actualizada con éxito"). Muestra un
 * ícono circular, título, mensaje y un botón de acción.
 *
 * Props:
 *  - visible:      controla la visibilidad
 *  - tipo:         "success" | "error" | "info"  (define el color del ícono)
 *  - titulo:       encabezado
 *  - mensaje:      cuerpo del mensaje
 *  - textoBoton:   texto del botón principal
 *  - onAccion:     acción del botón principal
 */
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import Icon from "./Icon";
import { colors } from "../theme/colors";

const CONFIG = {
  success: { fondo: colors.greenSoft, color: colors.greenLogo, icono: "checkmark-circle" },
  error: { fondo: "#FEE2E2", color: colors.danger, icono: "close-circle" },
  info: { fondo: colors.pinkTint, color: colors.magenta, icono: "information-circle" },
};

const AlertModal = ({
  visible,
  tipo = "success",
  titulo,
  mensaje,
  textoBoton = "Aceptar",
  onAccion,
}) => {
  const config = CONFIG[tipo] || CONFIG.success;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.fondo}>
        <View style={styles.tarjeta}>
          <View style={[styles.iconoCirculo, { backgroundColor: config.fondo }]}>
            <Icon name={config.icono} size={34} color={config.color} />
          </View>
          <Text style={[styles.titulo, { color: config.color }]}>{titulo}</Text>
          {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
          <View style={styles.botonWrap}>
            <CustomButton
              title={textoBoton}
              onPress={onAccion}
              variant={tipo === "success" ? "wine" : "pink"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  tarjeta: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 19, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  mensaje: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  botonWrap: { width: "100%", marginTop: 12 },
});