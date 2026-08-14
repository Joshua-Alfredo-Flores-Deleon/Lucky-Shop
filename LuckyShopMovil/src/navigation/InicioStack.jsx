/**
 * InicioStack.jsx
 * Stack de la pestaña "Inicio". Permite abrir el detalle de un producto (y desde
 * ahí seguir navegando) manteniendo visible el menú de pestañas.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/app/HomeScreen";
import ProductoDetalleScreen from "../screens/app/ProductoDetalleScreen";

const Stack = createNativeStackNavigator();

const InicioStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ProductoDetalle" component={ProductoDetalleScreen} />
  </Stack.Navigator>
);

export default InicioStack;
