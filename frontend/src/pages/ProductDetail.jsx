import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { toast } from 'react-toastify'
import {
  FiHeart, FiShoppingBag, FiMinus, FiPlus, FiArrowLeft, FiShare2,
  FiTruck, FiShield, FiClock, FiCheck, FiMapPin, FiGift
} from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

const ALL_PRODUCTS = [
  { id: 1, name: 'Rani Kundan Floral Bangle Pair', slug: 'rani-kundan-floral-bangle-pair', price: 2650, mrp: 3050, category: 'Bangles', image_url: '/images/products/bangle-pair.jpg', description: 'A regal pair of Kundan bangles featuring an intricate floral pattern. Set with vivid green kundan stones and pearl accents, these bangles are a timeless choice for weddings, festivals, and special occasions.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Kundan & Pearl'], ['Weight', '~95g (pair)'], ['Size', '2.4" / 2.6" / 2.8"'], ['Occasion', 'Bridal, Wedding, Festive']] },
  { id: 2, name: 'Green Stone Kundan Jhumka Earrings', slug: 'green-stone-kundan-jhumka-earrings', price: 1800, mrp: 2200, category: 'Earrings', image_url: '/images/products/jhumka-earrings.jpg', description: 'Elegantly crafted Kundan jhumka earrings with vivid green stone centres. The cascading bell design and intricate gold-tone work makes these perfect for both festive and casual wear.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Kundan'], ['Closure', 'Push back'], ['Length', '~5.5 cm'], ['Occasion', 'Festive, Casual, Party']] },
  { id: 3, name: 'Triple Layer Kundan Necklace Set', slug: 'triple-layer-kundan-necklace-set', price: 3200, mrp: 3800, category: 'Necklaces', image_url: '/images/products/necklace-set.jpg', description: 'A stunning triple-layer Kundan necklace set that exudes royalty. Features three tiers of intricate Kundan work with green stone drops and freshwater pearl beading, complete with matching earrings.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Kundan & Pearl'], ['Length', '14–18"'], ['Includes', 'Necklace + Earrings'], ['Occasion', 'Bridal, Wedding']] },
  { id: 4, name: 'Green Stone Cocktail Ring', slug: 'green-stone-cocktail-ring', price: 1250, mrp: 1600, category: 'Rings', image_url: '/images/products/cocktail-ring.jpg', description: 'A bold statement cocktail ring featuring a large emerald-green stone in a detailed gold-tone filigree setting. Adjustable band fits most sizes.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Green semi-precious'], ['Band', 'Adjustable'], ['Weight', '~15g'], ['Occasion', 'Party, Festive']] },
  { id: 5, name: 'Kundan Pearl Passa Hair Ornament', slug: 'kundan-pearl-passa-hair-ornament', price: 2400, mrp: 2800, category: 'Hair Accessories', image_url: '/images/products/passa-ornament.jpg', description: 'A traditional bridal side-tikka (passa) crafted with intricate Kundan work and cascading freshwater pearls. Worn to the left side of the head, this ornament elevates any bridal look.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Kundan & Pearl'], ['Chain length', '~18"'], ['Occasion', 'Bridal, Wedding']] },
  { id: 6, name: 'Ruby Heart Dial Cuff Watch', slug: 'ruby-heart-dial-cuff-watch', price: 2900, mrp: 3400, category: 'Watches', image_url: '/images/products/cuff-watch.jpg', description: 'A unique fusion of fashion jewellery and timepiece — the Ruby Heart Dial Cuff Watch features a heart-shaped ruby-red dial seamlessly integrated into an engraved gold-tone cuff bracelet.', specs: [['Movement', 'Quartz'], ['Metal', 'Gold-toned alloy'], ['Dial', 'Heart-shape, ruby red'], ['Water resistance', 'Splash resistant'], ['Battery', 'Included']] },
  { id: 7, name: 'Pearl Layer Peacock Necklace Set', slug: 'pearl-layer-peacock-necklace-set', price: 3500, mrp: 4100, category: 'Necklaces', image_url: '/images/products/peacock-necklace.jpg', description: 'Inspired by the grandeur of the Indian peacock, this multi-layer necklace set features a central peacock motif with enamel detailing and three layers of freshwater pearls.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Enamel & Pearl'], ['Length', '12–18"'], ['Includes', 'Necklace + Earrings'], ['Occasion', 'Bridal, Festive']] },
  { id: 8, name: 'Peacock Arch Pearl Jhumka Earrings', slug: 'peacock-arch-pearl-jhumka-earrings', price: 1950, mrp: 2400, category: 'Earrings', image_url: '/images/products/peacock-earrings.jpg', description: 'Beautifully crafted jhumka earrings with an arched peacock stud top and a hanging pearl jhumka bell. The peacock enamel work in blue and green makes these a unique statement piece.', specs: [['Metal', 'Gold-toned alloy'], ['Stone', 'Enamel & Pearl'], ['Length', '~5 cm'], ['Closure', 'Push back'], ['Occasion', 'Festive, Bridal']] },
  { id: 9, name: 'Sparkle Stone Bangle Pair', slug: 'sparkle-stone-bangle-pair', price: 1750, mrp: 2275, category: 'Bangles', image_url: '/images/products/sparkle-bangle.jpg', description: '', specs: [] },
  { id: 10, name: 'Pearl Fringe Meenakari Bangles', slug: 'pearl-fringe-meenakari-bangles', price: 2750, mrp: 3175, category: 'Bangles', image_url: '/images/products/meenakari-bangles.jpg', description: '', specs: [] },
  { id: 11, name: 'Royal Enamel Kada Pair', slug: 'royal-enamel-kada-pair', price: 2550, mrp: 2950, category: 'Bangles', image_url: '/images/products/bangle-pair.jpg', description: '', specs: [] },
  { id: 12, name: 'Rajwadi Blossom Kada Pair', slug: 'rajwadi-blossom-kada-pair', price: 2700, mrp: 3050, category: 'Bangles', image_url: '/images/products/meenakari-bangles.jpg', description: '', specs: [] },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')

  // Local Pincode delivery partner estimation
  const [pincode, setPincode] = useState('110001')
  const [deliveryInfo, setDeliveryInfo] = useState({ checked: true, city: 'Delhi NCR', eta: 'Tomorrow, by 5:00 PM', partner: 'Blue Dart Air Express ⚡' })

  useEffect(() => {
    setLoading(true)
    setQty(1)
    axios.get(`/api/products/${slug}`)
      .then(r => { setProduct(r.data.product); setRelated(r.data.related || []) })
      .catch(() => {
        const p = ALL_PRODUCTS.find(x => x.slug === slug)
        setProduct(p || null)
        if (p) setRelated(ALL_PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
  if (!product) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}><h2>Product not found</h2><Link to="/shop" className="btn btn-outline" style={{ marginTop: 20 }}>Back to Shop</Link></div>

  const wishlisted = isWishlisted(product.id)
  const discount = product.mrp && product.price < product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : null

  const handleAddToCart = () => {
    addToCart(product, qty)
    toast.success(
      <span>👑 <strong>{product.name}</strong> added to your bag!</span>
    )
  }

  const handlePincodeCheck = (e) => {
    e.preventDefault()
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      toast.error('Please enter a valid 6-digit Indian PIN code')
      return
    }
    if (pincode.startsWith('11') || pincode.startsWith('20') || pincode.startsWith('12')) {
      setDeliveryInfo({ checked: true, city: 'Delhi NCR', eta: 'Today / Tomorrow', partner: 'Same-Day Local NCR Courier 🛵' })
      toast.success('⚡ Same-day local delivery available!')
    } else {
      setDeliveryInfo({ checked: true, city: 'Pan-India Express', eta: '2–3 Business Days', partner: 'Blue Dart Air Express ✈️' })
      toast.info('✈️ Express delivery via Blue Dart Air')
    }
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      {/* ── Breadcrumb ── */}
      <div className="pd-breadcrumb container">
        <Link to="/"><FiArrowLeft size={13} /> Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main */}
      <div className="container pd-layout">
        {/* Image */}
        {/* ── Product Imagery ── */}
        <div className="pd-image-wrap">
          <img src={product.image_url} alt={product.name} className="pd-image" />
          <div className="pd-badges-stack">
            {discount && <span className="badge badge-sale pd-badge">🔥 {discount}% OFF</span>}
            <span className="badge badge-gold pd-badge">👑 Royal Hallmarked</span>
          </div>
        </div>

        {/* Info */}
        {/* ── Product Info & Actions ── */}
        <div className="pd-info">
          <span className="pd-category">👑 Handcrafted {product.category}</span>
          <h1 className="pd-title">{product.name}</h1>

          {/* Price row */}
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.mrp && product.price < product.mrp && (
              <>
                <span className="pd-mrp">₹{product.mrp?.toLocaleString('en-IN')}</span>
                <span className="pd-discount">Save {discount}%</span>
              </>
            )}
          </div>

          <div className="pd-tax-badge-row">
            <span className="tax-pill">📜 Incl. 3% Statutory GST</span>
            <span className="tax-pill">🚚 Free Delivery on ₹999+</span>
            <span className="tax-pill">⚡ Local Delivery Partner Ready</span>
          </div>

          {/* Qty */}
          {/* Scarcity indicator */}
          <div className="pd-scarcity">
            <span>🔥 Only <strong>3 pieces</strong> available in studio · 12 queens viewing right now</span>
          </div>

          {/* Quantity Selector */}
          <div className="pd-qty-row">
            <span className="pd-qty-label">Quantity</span>
            <div className="pd-qty-ctrl">
              <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus size={14} /></button>
              <span className="pd-qty-val">{qty}</span>
              <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)}><FiPlus size={14} /></button>
            </div>
          </div>

          {/* CTAs */}
          <div className="pd-ctas">
            <button className="btn btn-gold pd-cta-main" onClick={handleAddToCart}>
              <FiShoppingBag size={18} />
              <span>Add to Bag 🛍️</span>
            </button>
            <button
              className={`pd-wishlist-btn ${wishlisted ? 'pd-wishlist-btn--active' : ''}`}
              onClick={() => { toggle(product); toast.info(wishlisted ? 'Removed from saved pieces' : 'Saved to wishlist 💖') }}
              aria-label="Wishlist"
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              className="pd-share-btn"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard! 📋') }}
              title="Share piece"
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Trust */}
          {/* ── Local Delivery Partner Pincode Checker (iOS Card) ── */}
          <div className="pd-delivery-card ios-card">
            <div className="pdd-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiTruck size={17} style={{ color: 'var(--gold-dark)' }} />
                <strong>Local Delivery Partner & ETA</strong>
              </div>
              <span className="pdd-fastest">Delhi NCR Same-Day Available 🛵</span>
            </div>

            <form className="pdd-input-group" onSubmit={handlePincodeCheck}>
              <FiMapPin size={16} className="pdd-pin-icon" />
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code..."
                className="pdd-input"
              />
              <button type="submit" className="pdd-check-btn">Check ETA</button>
            </form>

            {deliveryInfo.checked && (
              <div className="pdd-result">
                <div className="pdd-result-item">
                  <span>Partner:</span> <strong>{deliveryInfo.partner}</strong>
                </div>
                <div className="pdd-result-item">
                  <span>Est. Arrival:</span> <strong style={{ color: 'var(--green)' }}>{deliveryInfo.eta}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          {/* iOS Style Trust Features Pills */}
          <div className="pd-trust-grid">
            <div className="pd-trust-pill">
              <span>💎</span>
              <div>
                <strong>Artisan 22K Finish</strong>
                <span>Lead & nickel free</span>
              </div>
            </div>
            <div className="pd-trust-pill">
              <span>🚚</span>
              <div>
                <strong>Blue Dart Express</strong>
                <span>Air transit insured</span>
              </div>
            </div>
            <div className="pd-trust-pill">
              <span>🔄</span>
              <div>
                <strong>7-Day Returns</strong>
                <span>Free doorstep pickup</span>
              </div>
            </div>
            <div className="pd-trust-pill">
              <span>🎁</span>
              <div>
                <strong>Velvet Packaging</strong>
                <span>Royal gift ready</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            {['description', 'specifications'].map(tab => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'pd-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? '✨ Craftsmanship & Story' : '📋 Product Specifications'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="pd-tab-content">
              <p>{product.description || 'Handcrafted fine jewellery featuring museum-grade Kundan and 22K gold micro-plating. Designed to elevate festive occasions, weddings, and memorable milestones.'}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="pd-tab-content">
              {product.specs && product.specs.length > 0 ? (
                <table className="pd-specs-table">
                  <tbody>
                    {product.specs.map(([k, v]) => (
                      <tr key={k}><td className="pd-spec-key">{k}</td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>Detailed specifications are confirmed upon request.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd-related container">
          <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: '4px' }}>
            👑 Complementary Heirlooms
          </p>
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 8 }}>
            Complete the Royal Look
          </h2>
          <div className="divider" style={{ margin: '0 0 36px' }} />
          <div className="pd-related-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
