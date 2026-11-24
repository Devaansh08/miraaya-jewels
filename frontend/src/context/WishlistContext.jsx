import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('mj_wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('mj_wishlist', JSON.stringify(items))
  }, [items])

  const toggle = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product]
    })
  }

  const isWishlisted = (id) => items.some(i => i.id === id)

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
