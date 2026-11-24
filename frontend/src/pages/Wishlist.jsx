import React from 'react'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import './Wishlist.css'

export default function Wishlist() {
  const { items } = useWishlist()

  if (items.length === 0) return (
    <div className="wishlist-empty container">
      <FiHeart size={56} className="wishlist-empty__icon" />
      <h2>Your Wishlist is Empty</h2>
      <p>Save pieces you love by clicking the heart icon on any product.</p>
      <Link to="/shop" className="btn btn-gold">Start Shopping</Link>
    </div>
  )

  return (
    <div className="wishlist-page container">
      <h1 className="wishlist-page__title">My Wishlist <span>({items.length})</span></h1>
      <div className="wishlist-grid">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
