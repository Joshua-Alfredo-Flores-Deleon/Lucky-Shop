/**
 * PerfilScreen.jsx
 * Pantalla de perfil del cliente. Muestra los datos REALES del usuario logueado
 * (nombre, correo) tomados del AuthContext, y permite cerrar sesión. El botón de
 * cerrar sesión limpia el token global y devuelve automáticamente al login.
 */
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Logo from "../../components/Logo";
import CustomButton from "../../components/CustomButton";
import AlertModal from "../../components/AlertModal";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

const PerfilScreen = () => {
  const { cliente, cerrarSesion } = useAuth();
  const [confirmar, setConfirmar] = useState(false);

  const nombreCompleto = [cliente?.name, cliente?.lastName].filter(Boolean).join(" ") || "Cliente";
  const inicial = (cliente?.name || "L").charAt(0).toUpperCase();

  // Opciones del menú de perfil (visuales para este avance).
  const opciones = [
    { icon: "heart-outline", label: "Mis favoritos" },
    { icon: "cube-outline", label: "Mis pedidos" },
    { icon: "location-outline", label: "Direcciones" },
    { icon: "settings-outline", label: "Configuración" },
  ];

  return (
    <View style={styles.pantalla}>
      <View style={styles.header}>
        <Logo size={22} mostrarSubtitulo={false} />
      </View>

      <Text style={styles.titulo}>Mi perfil</Text>

      {/* Tarjeta del usuario */}
      <View style={styles.tarjetaUsuario}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <View style={styles.datos}>
          <Text style={styles.nombre}>{nombreCompleto}</Text>
          <Text style={styles.correo}>{cliente?.email || "sin correo"}</Text>
        </View>
      </View>

      {/* Opciones */}
      <View style={styles.opciones}>
        {opciones.map((op) => (
          <TouchableOpacity key={op.label} style={styles.opcion} activeOpacity={0.7}>
            <Icon name={op.icon} size={20} color={colors.textGray} style={styles.opcionIcono} />
            <Text style={styles.opcionLabel}>{op.label}</Text>
            <Icon name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutWrap}>
        <CustomButton title="Cerrar sesión" variant="outline" onPress={() => setConfirmar(true)} />
      </View>

      {/* Confirmación de cierre de sesión */}
      <AlertModal
        visible={confirmar}
        tipo="info"
        titulo="¿Cerrar sesión?"
        mensaje="Tendrás que iniciar sesión de nuevo para acceder a tu cuenta."
        textoBoton="Sí, cerrar sesión"
        onAccion={() => {
          setConfirmar(false);
          cerrarSesion();
        }}
      />
    </View>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.white },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 6 },
  titulo: { fontSize: 24, fontWeight: "800", color: colors.textDark, paddingHorizontal: 20, marginTop: 6 },
  tarjetaUsuario: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.greenLogo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarTexto: { color: colors.white, fontSize: 24, fontWeight: "800" },
  datos: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: "800", color: colors.textDark },
  correo: { fontSize: 13, color: colors.textGray, marginTop: 2 },
  opciones: { marginTop: 22, paddingHorizontal: 20 },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  opcionIcono: { marginRight: 14 },
  opcionLabel: { flex: 1, fontSize: 15, color: colors.textDark, fontWeight: "600" },
  logoutWrap: { paddingHorizontal: 20, marginTop: 30 },
});