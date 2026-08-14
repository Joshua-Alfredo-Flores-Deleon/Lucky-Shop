/**
 * TabNavigator.jsx
 * Menú de navegación principal por pestañas (Tab menu), como indica el diseño de
 * Figma: Inicio, Categorías, Carrito y Perfil. Es la navegación central de la
 * parte privada de la app (usuario ya logueado).
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/app/HomeScreen";
import CategoriasScreen from "../screens/app/CategoriasScreen";
import CarritoScreen from "../screens/app/CarritoScreen";
import PerfilScreen from "../screens/app/PerfilScreen";
import Icon from "../components/Icon";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

// Nombre de icono Ionicons para cada pestaña.
const ICONOS = {
  Inicio: "home",
  Categorias: "grid",
  Carrito: "cart",
  Perfil: "person",
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.magenta,
        tabBarInactiveTintColor: colors.textGray,
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name={focused ? ICONOS[route.name] : `${ICONOS[route.name]}-outline`}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Categorias" component={CategoriasScreen} options={{ title: "Categorías" }} />
      <Tab.Screen name="Carrito" component={CarritoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;