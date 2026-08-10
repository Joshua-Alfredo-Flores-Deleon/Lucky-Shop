import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

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

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id))

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

  const clearCart = () => setItems([])

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateCantidad, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
