/**
 * CartContext.jsx
 * Contexto global del carrito de compras (useContext). Centraliza los productos
 * agregados, sus cantidades y los totales, y se comparte entre la pantalla de
 * detalle (añadir), el carrito, la pasarela de pago y la confirmación.
 *
 * El carrito se guarda en AsyncStorage para que sobreviva al cerrar la app.
 */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "@luckyshop_cart";
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // items: [{ producto, cantidad }]
  const [items, setItems] = useState([]);

  // Al montar, recuperamos el carrito guardado.
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(CART_KEY);
        if (data) setItems(JSON.parse(data));
      } catch (e) {
        console.log("Error cargando carrito:", e);
      }
    })();
  }, []);

  // Cada vez que cambian los items, los persistimos.
  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  // Agrega un producto (o suma cantidad si ya está en el carrito).
  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((it) => it.producto._id === producto._id);
      if (existente) {
        return prev.map((it) =>
          it.producto._id === producto._id
            ? { ...it, cantidad: it.cantidad + cantidad }
            : it,
        );
      }
      return [...prev, { producto, cantidad }];
    });
  };

  // Cambia la cantidad de un producto; si llega a 0 lo elimina.
  const cambiarCantidad = (productoId, delta) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.producto._id === productoId
            ? { ...it, cantidad: it.cantidad + delta }
            : it,
        )
        .filter((it) => it.cantidad > 0),
    );
  };

  // Elimina un producto del carrito.
  const eliminar = (productoId) => {
    setItems((prev) => prev.filter((it) => it.producto._id !== productoId));
  };

  // Vacía el carrito (tras una compra exitosa).
  const vaciar = () => setItems([]);

  // Totales derivados (se recalculan solo cuando cambian los items).
  const { totalItems, subtotal } = useMemo(() => {
    let totalItems = 0;
    let subtotal = 0;
    for (const it of items) {
      totalItems += it.cantidad;
      subtotal += it.cantidad * Number(it.producto.precio || 0);
    }
    return { totalItems, subtotal };
  }, [items]);

  const value = {
    items,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
};

export default CartContext;
