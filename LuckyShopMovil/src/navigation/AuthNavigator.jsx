/**
 * AuthNavigator.jsx
 * Stack de navegación para usuarios NO autenticados: login, registro y todo el
 * flujo de recuperación de contraseña. Las tres pantallas de recuperación se
 * envuelven en <RecoveryProvider> para compartir el token temporal entre ellas.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RecoveryEmailScreen from "../screens/auth/RecoveryEmailScreen";
import RecoveryPinScreen from "../screens/auth/RecoveryPinScreen";
import RecoveryNewPasswordScreen from "../screens/auth/RecoveryNewPasswordScreen";
import RecoverySuccessScreen from "../screens/auth/RecoverySuccessScreen";
import { RecoveryProvider } from "../context/RecoveryContext";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <RecoveryProvider>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RecoveryEmail" component={RecoveryEmailScreen} />
        <Stack.Screen name="RecoveryPin" component={RecoveryPinScreen} />
        <Stack.Screen name="RecoveryNewPassword" component={RecoveryNewPasswordScreen} />
        <Stack.Screen name="RecoverySuccess" component={RecoverySuccessScreen} />
      </Stack.Navigator>
    </RecoveryProvider>
  );
};

export default AuthNavigator;
