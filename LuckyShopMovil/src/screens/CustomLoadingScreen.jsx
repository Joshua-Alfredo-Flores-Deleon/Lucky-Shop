/**
 * CustomLoadingScreen.jsx
 * Pantalla de carga PERSONALIZADA que se muestra DESPUÉS del Splash Screen nativo
 * de Expo y ANTES de llevar al usuario al login o al home. Cumple el requisito de
 * "pantalla de bienvenida previa a cargar el login".
 *
 * Presenta el logo con una animación de aparición y una pequeña barra de
 * progreso. Cuando termina (o cuando el padre le indica), llama a `onFinish`.
 *
 * Props:
 *  - onFinish: callback que se ejecuta cuando la animación de carga concluye.
 */
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Easing } from "react-native";
import Logo from "../components/Logo";
import { colors } from "../theme/colors";

const CustomLoadingScreen = ({ onFinish }) => {
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.8)).current;
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) El logo aparece con fade + zoom.
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    // 2) La barra de progreso se llena y al terminar avisamos al padre.
    Animated.timing(progreso, {
      toValue: 1,
      duration: 2200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => onFinish && onFinish());
  }, []);

  const ancho = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.contenedor}>
      <Animated.View style={{ opacity: opacidad, transform: [{ scale: escala }] }}>
        <Logo size={40} />
        <Text style={styles.eslogan}>Tu viaje curado comienza aquí</Text>
      </Animated.View>

      <View style={styles.barraFondo}>
        <Animated.View style={[styles.barraProgreso, { width: ancho }]} />
      </View>
    </View>
  );
};

export default CustomLoadingScreen;

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  eslogan: {
    marginTop: 14,
    fontSize: 13,
    color: colors.textGray,
    textAlign: "center",
    fontWeight: "500",
  },
  barraFondo: {
    position: "absolute",
    bottom: 90,
    width: 180,
    height: 6,
    backgroundColor: colors.pinkSoft,
    borderRadius: 3,
    overflow: "hidden",
  },
  barraProgreso: { height: "100%", backgroundColor: colors.magenta, borderRadius: 3 },
});
