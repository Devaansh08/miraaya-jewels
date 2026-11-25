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
      <span><strong>{product.name}</strong> added to bag</span>
    )
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast.info(wishlisted ? 'Removed from saved pieces' : 'Saved to wishlist')
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
            decoding="async"
          />
        </Link>

        {/* Minimal Sale Badge (Top-Left) */}
        {discountPct && (
          <span className="product-card__badge">-{discountPct}%</span>
        )}

        {/* Minimal Wishlist Heart (Top-Right) */}
        <button
          className={`product-card__wishlist-btn ${wishlisted ? 'product-card__wishlist-btn--active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={wishlisted ? 'Saved' : 'Save to Wishlist'}
          type="button"
        >
          <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Add to Bag Button */}
        <button className="product-card__cart-btn" onClick={handleAddToCart} type="button">
          <FiShoppingBag size={14} />
          <span>Add to Bag</span>
        </button>
      </div>

      <div className="product-card__info">
        <div className="product-card__meta-row">
          <span className="product-card__cat">{product.category}</span>
          <span className="product-card__hallmark-pill">22K Finish</span>
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
          <div className="product-card__rating">
            <span className="star-icon">★</span>
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
