/**
 * CheckoutScreen.jsx
 * Pasarela de pago (simulada, para este avance). Muestra el total a pagar y un
 * formulario de tarjeta (titular, número, caducidad, CVV) con una vista previa
 * de la tarjeta. Al "pagar", vacía el carrito y navega a la pantalla de éxito.
 *
 * NOTA: es una simulación de front-end; no se procesa un pago real ni se envían
 * datos sensibles a ningún servidor.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Logo from "../../components/Logo";
import CustomButton from "../../components/CustomButton";
import Notificacion from "../../components/Notificacion";
import Icon from "../../components/Icon";
import useNotificacion from "../../hooks/useNotificacion";
import { useCart } from "../../context/CartContext";
import { colors } from "../../theme/colors";

const CheckoutScreen = ({ route, navigation }) => {
  const { items, subtotal, vaciar } = useCart();
  const { notificacion, mostrar, ocultar } = useNotificacion();

  const total = route?.params?.total ?? subtotal;

  const [titular, setTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvv, setCvv] = useState("");

  // Formatea el número de tarjeta en grupos de 4 dígitos.
  const formatearNumero = (texto) => {
    const soloDigitos = texto.replace(/\D/g, "").slice(0, 16);
    const grupos = soloDigitos.match(/.{1,4}/g);
    setNumero(grupos ? grupos.join(" ") : "");
  };

  // Muestra los últimos 4 dígitos en la vista previa de la tarjeta.
  const ultimos4 = numero.replace(/\D/g, "").slice(-4).padStart(4, "•");

  const manejarPago = () => {
    if (!titular || numero.replace(/\D/g, "").length < 16 || !caducidad || !cvv) {
      mostrar("Completa todos los datos de la tarjeta", "error");
      return;
    }
    // Simulación de pago exitoso.
    const pedido = {
      numeroPedido: `LK-${Math.floor(100000 + Math.random() * 900000)}`,
      total,
      productos: items,
    };
    vaciar();
    navigation.navigate("PagoExitoso", pedido);
  };

  return (
    <View style={styles.pantalla}>
      <Notificacion {...notificacion} onHide={ocultar} />

      {/* Encabezado */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="arrow-back" size={22} color={colors.greenLogo} />
        </TouchableOpacity>
        <Logo size={20} mostrarSubtitulo={false} />
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contenido}>
          <Text style={styles.titulo}>Pasarela de pago segura</Text>
          <Text style={styles.subtitulo}>Pago con tarjeta de crédito</Text>

          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalMonto}>${total.toFixed(2)}</Text>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Nombre del titular</Text>
            <TextInput
              style={styles.input}
              value={titular}
              onChangeText={setTitular}
              placeholder="Ej. Ana García"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.label}>Número de tarjeta</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={formatearNumero}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
            />

            <View style={styles.fila}>
              <View style={styles.mitad}>
                <Text style={styles.label}>Fecha de caducidad</Text>
                <TextInput
                  style={styles.input}
                  value={caducidad}
                  onChangeText={setCaducidad}
                  placeholder="MM/AA"
                  placeholderTextColor={colors.textLight}
                  maxLength={5}
                />
              </View>
              <View style={styles.mitad}>
                <Text style={styles.label}>CVV/CVC</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Vista previa de la tarjeta */}
            <View style={styles.tarjeta}>
              <Text style={styles.tarjetaMarca}>Lucky tarjeta</Text>
              <Text style={styles.tarjetaNumero}>•••• •••• •••• {ultimos4}</Text>
              <Text style={styles.tarjetaFecha}>{caducidad || "MM/AA"}</Text>
            </View>
          </View>

          <CustomButton
            title={`Pagar $${total.toFixed(2)}`}
            icon="arrow-forward"
            onPress={manejarPago}
          />

          <Text style={styles.seguro}>Tu pago es 100% seguro</Text>
          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  contenido: { paddingHorizontal: 20 },
  titulo: { fontSize: 22, fontWeight: "800", color: colors.textDark, textAlign: "center", marginTop: 6 },
  subtitulo: { fontSize: 14, color: colors.textGray, textAlign: "center", marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: "800", color: colors.textDark, textAlign: "center", marginTop: 16 },
  totalMonto: { fontSize: 36, fontWeight: "800", color: colors.textDark, textAlign: "center", marginTop: 4 },
  form: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.textDark, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textDark,
  },
  fila: { flexDirection: "row", justifyContent: "space-between" },
  mitad: { width: "48%" },
  tarjeta: {
    backgroundColor: colors.darkGreen,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    height: 120,
    justifyContent: "space-between",
  },
  tarjetaMarca: { color: colors.white, fontSize: 14, fontWeight: "700" },
  tarjetaNumero: { color: colors.white, fontSize: 18, letterSpacing: 2, fontWeight: "600" },
  tarjetaFecha: { color: colors.white, fontSize: 12, alignSelf: "flex-end" },
  seguro: { textAlign: "center", color: colors.greenLogo, fontSize: 12, marginTop: 12, fontWeight: "600" },
});
