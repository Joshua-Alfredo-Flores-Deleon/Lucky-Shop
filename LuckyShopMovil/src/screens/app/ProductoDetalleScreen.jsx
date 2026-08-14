/**
 * ProductoDetalleScreen.jsx
 * Pantalla de detalle de un producto. Recibe el producto por parámetros de
 * navegación (route.params.producto). Muestra imagen destacada, nombre, badge de
 * estado, descripción, detalles (material/longitud), precio, un selector de
 * cantidad y el botón "Añadir al carrito". Al final, una sección de productos
 * relacionados de la misma categoría ("También te puede interesar").
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import ProductCard from "../../components/ProductCard";
import Notificacion from "../../components/Notificacion";
import Icon from "../../components/Icon";
import useProductos from "../../hooks/useProductos";
import useNotificacion from "../../hooks/useNotificacion";
import { useCart } from "../../context/CartContext";
import { colors } from "../../theme/colors";

const ProductoDetalleScreen = ({ route, navigation }) => {
  const { producto } = route.params;
  const { agregar, totalItems } = useCart();
  const { notificacion, mostrar, ocultar } = useNotificacion();

  const [cantidad, setCantidad] = useState(1);

  // Productos relacionados: misma categoría, excluyendo el actual.
  const { productos: relacionados } = useProductos({ categoria: producto?.idCategoria });
  const sugerencias = relacionados.filter((p) => p._id !== producto._id).slice(0, 4);

  const uri = producto?.imagenPresentacion || producto?.imagenes?.[0] || null;
  const precio = Number(producto?.precio || 0).toFixed(2);

  const manejarAgregar = () => {
    agregar(producto, cantidad);
    mostrar(`Se agregó ${cantidad} al carrito`, "success");
  };

  return (
    <View style={styles.pantalla}>
      <Notificacion {...notificacion} onHide={ocultar} />

      {/* Barra superior: regresar + carrito */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Carrito")} hitSlop={12}>
          <Icon name="cart-outline" size={24} color={colors.textDark} />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contenido}>
        {/* Imagen destacada */}
        <View style={styles.imagenWrap}>
          {uri ? (
            <Image source={{ uri }} style={styles.imagen} resizeMode="cover" />
          ) : (
            <View style={[styles.imagen, styles.imagenVacia]} />
          )}
        </View>

        {/* Nombre */}
        <Text style={styles.nombre}>{producto?.nombre}</Text>

        {/* Badge de estado */}
        {producto?.masVendido || producto?.estado === "activo" ? (
          <View style={styles.badgeEstado}>
            <Text style={styles.badgeEstadoTexto}>
              {producto?.masVendido ? "Más vendido" : "Disponible"}
            </Text>
          </View>
        ) : null}

        {/* Descripción */}
        {producto?.descripcion ? (
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        ) : null}

        {/* Detalles opcionales */}
        {producto?.material ? (
          <Text style={styles.detalle}>Material: {producto.material}</Text>
        ) : null}
        {producto?.longitud ? (
          <Text style={styles.detalle}>Longitud: {producto.longitud}</Text>
        ) : null}
        {producto?.subCategoria ? (
          <Text style={styles.detalle}>Categoría: {producto.subCategoria}</Text>
        ) : null}

        {/* Precio + selector de cantidad */}
        <View style={styles.filaPrecio}>
          <Text style={styles.precio}>${precio}</Text>

          <View style={styles.selector}>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setCantidad((c) => Math.max(1, c - 1))}
            >
              <Icon name="remove" size={18} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.selectorCantidad}>{cantidad}</Text>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setCantidad((c) => c + 1)}
            >
              <Icon name="add" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Añadir al carrito */}
        <CustomButton title="Añadir al carrito" onPress={manejarAgregar} />

        {/* También te puede interesar */}
        {sugerencias.length > 0 && (
          <>
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionTitulo}>También te puede interesar</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Categorias", { screen: "CategoriasHome", params: { slug: producto.idCategoria } })
                }
              >
                <View style={styles.verMasWrap}>
                  <Text style={styles.verMas}>Ver más</Text>
                  <Icon name="chevron-forward" size={14} color={colors.magenta} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {sugerencias.map((p) => (
                <ProductCard
                  key={p._id}
                  producto={p}
                  onPress={() => navigation.push("ProductoDetalle", { producto: p })}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default ProductoDetalleScreen;

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 8,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: colors.magenta,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeTexto: { color: colors.white, fontSize: 9, fontWeight: "800" },
  contenido: { paddingHorizontal: 20, paddingBottom: 20 },
  imagenWrap: { borderRadius: 20, overflow: "hidden", backgroundColor: colors.surface },
  imagen: { width: "100%", height: 260 },
  imagenVacia: { backgroundColor: colors.pinkSoft },
  nombre: { fontSize: 22, fontWeight: "800", color: colors.textDark, marginTop: 16 },
  badgeEstado: {
    alignSelf: "flex-start",
    backgroundColor: colors.pinkSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  badgeEstadoTexto: { color: colors.magenta, fontSize: 12, fontWeight: "700" },
  descripcion: { fontSize: 14, color: colors.textGray, lineHeight: 20, marginTop: 14 },
  detalle: { fontSize: 14, color: colors.textDark, marginTop: 6 },
  filaPrecio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 16,
  },
  precio: { fontSize: 24, fontWeight: "800", color: colors.greenLogo },
  selector: { flexDirection: "row", alignItems: "center" },
  selectorBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorCantidad: {
    minWidth: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: colors.textDark,
  },
  seccionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 14,
  },
  seccionTitulo: { fontSize: 17, fontWeight: "800", color: colors.textDark },
  verMas: { fontSize: 13, color: colors.magenta, fontWeight: "700" },
  verMasWrap: { flexDirection: "row", alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
