/**
 * CarritoStack.jsx
 * Stack de la pestaña "Carrito": carrito -> pasarela de pago -> confirmación.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarritoScreen from "../screens/app/CarritoScreen";
import CheckoutScreen from "../screens/app/CheckoutScreen";
import PagoExitosoScreen from "../screens/app/PagoExitosoScreen";

const Stack = createNativeStackNavigator();

const CarritoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CarritoHome" component={CarritoScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="PagoExitoso" component={PagoExitosoScreen} />
  </Stack.Navigator>
);

export default CarritoStack;
