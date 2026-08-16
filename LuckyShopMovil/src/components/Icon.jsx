/**
 * Icon.jsx
 * Componente central de iconos de la app. Envuelve @expo/vector-icons (incluido
 * con Expo, no requiere instalación) para tener un único punto donde se define
 * qué set de iconos usamos y sus tamaños/colores por defecto.
 *
 * Uso: <Icon name="cart-outline" size={20} color="#333" />
 * Los nombres corresponden al set Ionicons: https://icons.expo.fyi
 */
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const Icon = ({ name, size = 20, color = colors.textDark, style }) => {
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

export default Icon;