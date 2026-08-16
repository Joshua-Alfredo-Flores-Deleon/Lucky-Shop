/**
 * PerfilStack.jsx
 * Stack de la pestaña "Perfil".
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PerfilScreen from "../screens/app/PerfilScreen";

const Stack = createNativeStackNavigator();

const PerfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerfilHome" component={PerfilScreen} />
  </Stack.Navigator>
);

export default PerfilStack;
