/**
 * TabNavigator.jsx
 * Menú de navegación principal por pestañas (Tab menu): Inicio, Categorías,
 * Carrito y Perfil. Cada pestaña usa su propio stack para poder abrir pantallas
 * internas (detalle de producto, pasarela de pago, etc.) manteniendo el tab bar.
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import InicioStack from "./InicioStack";
import CategoriasStack from "./CategoriasStack";
import CarritoStack from "./CarritoStack";
import PerfilStack from "./PerfilStack";
import Icon from "../components/Icon";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const ICONOS = { Inicio: "home", Categorias: "grid", Carrito: "cart", Perfil: "person" };

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.magenta,
        tabBarInactiveTintColor: colors.textGray,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarIcon: ({ color, focused }) => (
          <Icon name={focused ? ICONOS[route.name] : `${ICONOS[route.name]}-outline`} size={22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={InicioStack} />
      <Tab.Screen name="Categorias" component={CategoriasStack} options={{ title: "Categorías" }} />
      <Tab.Screen name="Carrito" component={CarritoStack} />
      <Tab.Screen name="Perfil" component={PerfilStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
