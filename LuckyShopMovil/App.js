/**
 * App.js
 * Punto de entrada de la aplicación. Se mantiene con la MENOR cantidad de código
 * posible (requisito de estructura): solo controla el Splash Screen nativo y
 * monta los proveedores globales y el navegador raíz.
 *
 *   SafeAreaProvider  -> respeta notch y áreas seguras del dispositivo.
 *   AuthProvider      -> estado global de sesión (useContext).
 *   AppNavigator      -> decide entre autenticación y app principal.
 */
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Evita que el Splash Screen nativo se oculte automáticamente hasta que la app
// esté lista.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    // Aquí podríamos precargar fuentes o recursos. Cuando termine, ocultamos el
    // Splash nativo y dejamos que la pantalla de carga personalizada tome el
    // control.
    const preparar = async () => {
      try {
        // Pequeña espera para que el Splash nativo con el logo sea visible.
        await new Promise((resolve) => setTimeout(resolve, 400));
      } finally {
        setListo(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    };
    preparar();
  }, []);

  if (!listo) return null; // El Splash nativo sigue visible.

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
