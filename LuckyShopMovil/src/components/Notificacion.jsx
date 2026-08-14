/**
 * Notificacion.jsx
 * Banner tipo "toast" que se desliza desde la parte superior para confirmar
 * acciones, informar errores o dar avisos al usuario (requisito de
 * notificaciones/alertas visuales). Se controla con props y se auto-oculta.
 *
 * Props:
 *  - visible: si se muestra
 *  - tipo:    "success" | "error" | "info"
 *  - mensaje: texto a mostrar
 *  - onHide:  callback cuando termina de ocultarse
 */
import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";

const CONFIG = {
  success: { fondo: colors.success, icono: "checkmark-circle" },
  error: { fondo: colors.danger, icono: "alert-circle" },
  info: { fondo: colors.greenBg, icono: "information-circle" },
};

const Notificacion = ({ visible, tipo = "info", mensaje, onHide }) => {
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      // Entra deslizando hacia abajo...
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      // ...y se oculta sola a los 3 segundos.
      const timer = setTimeout(ocultar, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const ocultar = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onHide && onHide());
  };

  if (!visible) return null;
  const config = CONFIG[tipo] || CONFIG.info;

  return (
    <Animated.View
      style={[styles.contenedor, { backgroundColor: config.fondo, transform: [{ translateY }] }]}
    >
      <Icon name={config.icono} size={20} color={colors.white} />
      <Text style={styles.mensaje} numberOfLines={2}>
        {mensaje}
      </Text>
      <TouchableOpacity onPress={ocultar} hitSlop={10}>
        <Icon name="close" size={18} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Notificacion;

const styles = StyleSheet.create({
  contenedor: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  mensaje: { flex: 1, color: colors.white, fontSize: 14, fontWeight: "600", marginHorizontal: 8 },
});