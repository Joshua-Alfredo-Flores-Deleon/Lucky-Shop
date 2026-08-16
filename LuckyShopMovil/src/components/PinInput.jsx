/**
 * PinInput.jsx
 * Componente reutilizable de casillas para ingresar un código PIN (usado en la
 * verificación por correo del registro y de la recuperación de contraseña).
 * Renderiza `length` casillas y avanza/retrocede el foco automáticamente.
 *
 * Props:
 *  - length:   cantidad de casillas (default 6)
 *  - value:    string con el código actual
 *  - onChange: recibe el nuevo string del código
 */
import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const PinInput = ({ length = 6, value = "", onChange }) => {
  const refs = useRef([]);

  const manejarCambio = (texto, index) => {
    // Solo tomamos el último carácter escrito en la casilla.
    const caracter = texto.slice(-1);
    const arreglo = value.split("");
    arreglo[index] = caracter;
    const nuevo = arreglo.join("").slice(0, length);
    onChange(nuevo);

    // Avanzar el foco a la siguiente casilla si se escribió algo.
    if (caracter && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const manejarBorrado = (e, index) => {
    // Al borrar en una casilla vacía, regresamos el foco a la anterior.
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.fila}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (refs.current[index] = el)}
          style={[styles.casilla, value[index] && styles.casillaLlena]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ""}
          onChangeText={(t) => manejarCambio(t, index)}
          onKeyPress={(e) => manejarBorrado(e, index)}
        />
      ))}
    </View>
  );
};

export default PinInput;

const styles = StyleSheet.create({
  fila: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  casilla: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.greenSoft,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    backgroundColor: colors.white,
  },
  casillaLlena: { borderColor: colors.wine },
});
