import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  const addItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i._id === producto._id)
      if (exists) {
        return prev.map((i) =>
          i._id === producto._id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id))

  const updateCantidad = (id, cantidad) => {
    if (cantidad < 1) return removeItem(id)
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, cantidad } : i)))
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
