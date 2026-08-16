/**
 * AppNavigator.jsx
 * Navegador RAÍZ de la aplicación. Decide qué mostrar según el estado global de
 * autenticación (AuthContext):
 *   - Mientras se valida la sesión inicial -> pantalla de carga personalizada.
 *   - Si NO hay sesión -> stack de autenticación (AuthNavigator).
 *   - Si hay sesión activa -> menú principal por pestañas (TabNavigator).
 *
 * Al cambiar el estado de autenticación (login/logout), React Navigation cambia
 * automáticamente de un navegador a otro sin que las pantallas naveguen a mano.
 */
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import CustomLoadingScreen from "../screens/CustomLoadingScreen";
import { useAuth } from "../context/AuthContext";

const AppNavigator = () => {
  const { estaAutenticado, cargandoSesion } = useAuth();
  // Controla que la pantalla de carga personalizada dure lo que su animación.
  const [animacionLista, setAnimacionLista] = useState(false);

  // Mostramos la carga personalizada hasta que termine su animación Y hasta que
  // el AuthContext haya validado la sesión guardada.
  if (!animacionLista || cargandoSesion) {
    return <CustomLoadingScreen onFinish={() => setAnimacionLista(true)} />;
  }

  return (
    <NavigationContainer>
      {estaAutenticado ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
