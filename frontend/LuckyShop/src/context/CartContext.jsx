import { createContext, useContext, useState } from 'react'

// Contexto del carrito de compras, compartido en toda la app
const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // Lista de productos en el carrito, cada uno con su cantidad
  const [items, setItems] = useState([])

  // Agrega un producto al carrito. Si ya existe, suma la cantidad;
  // si no existe, lo agrega como nuevo item. En ambos casos, la
  // cantidad final nunca puede superar el stock disponible.
  const addItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i._id === producto._id)
      if (exists) {
        return prev.map((i) => {
          if (i._id === producto._id) {
            const nuevaCantidad = i.cantidad + cantidad;
            // Validar que no exceda el stock
            return { ...i, cantidad: nuevaCantidad > i.stock ? i.stock : nuevaCantidad };
          }
          return i;
        })
      }
      // Validar si la cantidad inicial no excede el stock
      const cantidadInicial = cantidad > producto.stock ? producto.stock : cantidad;
      return [...prev, { ...producto, cantidad: cantidadInicial }]
    })
  }

  // Quita un producto del carrito por completo
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id))

  // Actualiza la cantidad de un producto ya en el carrito.
  // Si la cantidad baja de 1, se elimina el producto del carrito.
  const updateCantidad = (id, cantidad) => {
    if (cantidad < 1) return removeItem(id)
    setItems((prev) => prev.map((i) => {
      if (i._id === id) {
        // Validar que no exceda el stock
        const validCantidad = cantidad > i.stock ? i.stock : cantidad;
        return { ...i, cantidad: validCantidad };
      }
      return i;
    }))
  }

  // Vacía el carrito por completo
  const clearCart = () => setItems([])

  // Total en dinero y cantidad total de artículos en el carrito
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateCantidad, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook para consumir el contexto del carrito desde cualquier componente
export const useCart = () => useContext(CartContext)