/**
 * CustomInput.jsx
 * Campo de texto reutilizable con etiqueta, ícono a la izquierda y, para las
 * contraseñas, un botón de "mostrar/ocultar" (el ojito del diseño).
 *
 * Props principales:
 *  - label:        etiqueta encima del campo
 *  - icon:         emoji/ícono a la izquierda (ej: "✉️", "🔒")
 *  - value/onChangeText: control del texto
 *  - placeholder:  texto de ayuda
 *  - secure:       si es true, oculta el texto y muestra el ojito
 *  - keyboardType, autoCapitalize: se pasan tal cual al TextInput nativo
 */
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const CustomInput = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  // Estado local que controla si la contraseña se ve u oculta.
  const [oculto, setOculto] = useState(secure);

  return (
    <View style={styles.contenedor}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.caja}>
        {icon ? <Text style={styles.icono}>{icon}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={oculto}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setOculto((v) => !v)} hitSlop={10}>
            <Text style={styles.ojo}>{oculto ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  contenedor: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 8,
  },
  caja: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  icono: { fontSize: 16, marginRight: 8, color: colors.textGray },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textDark,
  },
  ojo: { fontSize: 18, paddingLeft: 8 },
});
