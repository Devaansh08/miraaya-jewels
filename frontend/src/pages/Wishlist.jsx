import React from 'react'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { FiHeart, FiArrowRight } from 'react-icons/fi'
import './Wishlist.css'

export default function Wishlist() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="wishlist-empty container">
        <div className="wishlist-empty__icon-wrap">
          <FiHeart size={38} />
        </div>
        <p className="section-subtitle">Curated Saved Pieces</p>
        <h1 className="section-title">Your Wishlist is Empty</h1>
        <div className="divider" />
        <p className="wishlist-empty__desc">
          Save your favorite royal Kundan chokers, cocktail rings, and bridal Polki sets by tapping the heart icon on any piece.
        </p>
        <Link to="/shop" className="btn btn-gold" style={{ marginTop: '16px' }}>
          <span>Explore Collection</span>
          <FiArrowRight size={15} />
        </Link>
      </div>
    )
  }

  return (
    <div className="wishlist-page container">
      <div className="wishlist-page__header">
        <p className="section-subtitle">Curated Saved Pieces</p>
        <h1 className="section-title">My Saved Wishlist</h1>
        <div className="divider" />
        <p className="wishlist-page__count">{items.length} royal piece{items.length !== 1 ? 's' : ''} saved</p>
      </div>
      <div className="product-grid">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
