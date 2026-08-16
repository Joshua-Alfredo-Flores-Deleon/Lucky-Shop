/**
 * PagoExitosoScreen.jsx
 * Confirmación de compra exitosa. Recibe por parámetros el número de pedido, el
 * total y los productos comprados. Muestra un resumen del pedido y botones para
 * regresar al inicio o ver los pedidos.
 */
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import CustomButton from "../../components/CustomButton";
import Icon from "../../components/Icon";
import { colors } from "../../theme/colors";

const PagoExitosoScreen = ({ route, navigation }) => {
  const { numeroPedido = "LK-000000", total = 0, productos = [] } = route?.params || {};

  const primero = productos[0]?.producto;
  const uri = primero?.imagenPresentacion || primero?.imagenes?.[0];
  const otros = Math.max(productos.length - 1, 0);

  // Vuelve a la primera pantalla del tab (Home).
  const irAlInicio = () => {
    navigation.popToTop();
    navigation.navigate("Inicio");
  };

  return (
    <View style={styles.pantalla}>
      <View style={styles.centro}>
        {/* Círculo de éxito */}
        <View style={styles.circuloGrande}>
          <Icon name="checkmark" size={44} color={colors.white} />
        </View>

        <Text style={styles.titulo}>¡Pago realizado con éxito!</Text>
        <Text style={styles.descripcion}>
          Tu compra ha sido procesada correctamente. Recibirás un correo de
          confirmación pronto.
        </Text>

        {/* Detalles del pedido */}
        <View style={styles.tarjeta}>
          <View style={styles.tarjetaHeader}>
            <Text style={styles.tarjetaTitulo}>DETALLES DEL PEDIDO</Text>
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoTexto}>Procesando</Text>
            </View>
          </View>

          <View style={styles.filaDetalle}>
            <Text style={styles.detalleLabel}>Pedido #</Text>
            <Text style={styles.detalleValor}>{numeroPedido}</Text>
          </View>
          <View style={styles.filaDetalle}>
            <Text style={styles.detalleLabel}>Total</Text>
            <Text style={styles.detalleTotal}>${Number(total).toFixed(2)}</Text>
          </View>

          {primero && (
            <View style={styles.productoResumen}>
              {uri ? (
                <Image source={{ uri }} style={styles.productoImg} />
              ) : (
                <View style={[styles.productoImg, { backgroundColor: colors.pinkSoft }]} />
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productoNombre} numberOfLines={1}>{primero.nombre}</Text>
                {otros > 0 && <Text style={styles.productoOtros}>y {otros} artículos más...</Text>}
              </View>
            </View>
          )}
        </View>

        <View style={styles.acciones}>
          <CustomButton title="Regresar al inicio" onPress={irAlInicio} />
        </View>
      </View>
    </View>
  );
};

export default PagoExitosoScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.white },
  centro: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  circuloGrande: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 22,
  },
  titulo: { fontSize: 24, fontWeight: "800", color: colors.greenLogo, textAlign: "center" },
  descripcion: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  tarjeta: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tarjetaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  tarjetaTitulo: { fontSize: 12, fontWeight: "800", color: colors.textGray, letterSpacing: 0.5 },
  estadoBadge: { backgroundColor: colors.greenSoft, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  estadoTexto: { fontSize: 11, fontWeight: "700", color: colors.greenLogo },
  filaDetalle: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  detalleLabel: { fontSize: 14, color: colors.textGray },
  detalleValor: { fontSize: 14, fontWeight: "700", color: colors.textDark },
  detalleTotal: { fontSize: 16, fontWeight: "800", color: colors.greenLogo },
  productoResumen: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, padding: 10, marginTop: 14 },
  productoImg: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.pinkSoft },
  productoNombre: { fontSize: 14, fontWeight: "700", color: colors.textDark },
  productoOtros: { fontSize: 12, color: colors.textGray, marginTop: 2 },
  acciones: { marginTop: 24 },
});
