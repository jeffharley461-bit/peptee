import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peptideforge_cart') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('peptideforge_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { product, qty }]
    })
  }

  const removeFromCart = productId => setItems(prev => prev.filter(i => i.product.id !== productId))

  const updateQty = (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + (parseFloat(i.product.price_usd) || 0) * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
