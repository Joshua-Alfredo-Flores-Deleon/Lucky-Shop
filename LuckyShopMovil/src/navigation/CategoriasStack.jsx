/**
 * CategoriasStack.jsx
 * Stack de la pestaña "Categorías". Incluye el detalle de producto para poder
 * abrirlo desde la cuadrícula sin perder el menú de pestañas.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CategoriasScreen from "../screens/app/CategoriasScreen";
import ProductoDetalleScreen from "../screens/app/ProductoDetalleScreen";

const Stack = createNativeStackNavigator();

const CategoriasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CategoriasHome" component={CategoriasScreen} />
    <Stack.Screen name="ProductoDetalle" component={ProductoDetalleScreen} />
  </Stack.Navigator>
);

export default CategoriasStack;
