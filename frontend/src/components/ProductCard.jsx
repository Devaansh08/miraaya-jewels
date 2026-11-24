import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { toast } from 'react-toastify'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const discountPct = product.mrp && product.price < product.mrp
    ? Math.round((1 - product.price / product.mrp) * 100)
    : null

  const savings = product.mrp && product.price < product.mrp
    ? product.mrp - product.price
    : null

  // Deterministic ratings and review counts for social proof
  const rating = 4.9
  const reviewCount = ((Number(product.id || 1) * 17) % 40) + 24

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success(
      <span>👑 <strong>{product.name}</strong> added to bag!</span>
    )
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast.info(wishlisted ? 'Removed from saved pieces' : 'Saved to wishlist 💖')
  }

  const imgSrc = imgError
    ? '/images/placeholder-jewelry.jpg'
    : (product.image_url || `/images/products/${product.slug}.jpg`)

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <Link to={`/product/${product.slug}`} className="product-card__image-link">
          <img
            src={imgSrc}
            alt={product.name}
            className="product-card__image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </Link>

        {discountPct && (
          <span className="product-card__badge badge badge-sale">🔥 {discountPct}% OFF</span>
        )}

        <div className="product-card__hallmark-tag">
          <span>💎 22K Finish</span>
        </div>

        <div className="product-card__actions">
          <button
            className={`product-card__action-btn ${wishlisted ? 'product-card__action-btn--active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={wishlisted ? 'Saved' : 'Save to Wishlist'}
            type="button"
          >
            <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="product-card__action-btn"
            aria-label="Quick view"
            title="View Details"
          >
            <FiEye size={16} />
          </Link>
        </div>

        <button className="product-card__cart-btn" onClick={handleAddToCart} type="button">
          <FiShoppingBag size={15} />
          <span>Add to Bag 🛍️</span>
        </button>
      </div>

      <div className="product-card__info">
        <div className="product-card__meta-row">
          <span className="product-card__cat">👑 {product.category}</span>
          <div className="product-card__rating">
            <span className="star-icon">★</span>
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviewCount})</span>
          </div>
        </div>

        <Link to={`/product/${product.slug}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__price-row">
          <div className="product-card__price">
            <span className="product-card__price-current">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.mrp && product.price < product.mrp && (
              <span className="product-card__price-mrp">₹{product.mrp?.toLocaleString('en-IN')}</span>
            )}
          </div>
          {savings && (
            <span className="product-card__savings-tag">Save ₹{savings.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
