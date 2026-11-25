import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import {
  FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag, FiTruck, FiGift,
  FiTag, FiShield, FiCheck, FiMapPin, FiCreditCard, FiClock
} from 'react-icons/fi'
import './Cart.css'

const DELIVERY_PARTNERS = [
  {
    id: 'bluedart',
    name: 'Blue Dart Air Express',
    badge: 'Fastest',
    estimate: '1–2 Business Days',
    price: 99,
    freeThreshold: 999,
    desc: 'Priority air courier with real-time SMS tracking'
  },
  {
    id: 'local_ncr',
    name: 'Shiprocket Local Same-Day',
    badge: 'Delhi NCR Only',
    estimate: 'Today by 7:00 PM',
    price: 149,
    freeThreshold: 1999,
    desc: 'Direct doorstep rider dispatch from our NCR studio'
  },
  {
    id: 'delhivery',
    name: 'Delhivery Standard Surface',
    badge: 'Economy',
    estimate: '3–5 Business Days',
    price: 0,
    freeThreshold: 0,
    desc: 'Reliable pan-India delivery across 19,000+ pin codes'
  }
]

export default function Cart() {
  const { items, updateQty, removeFromCart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  // Delivery partner selection
  const [selectedPartner, setSelectedPartner] = useState('bluedart')
  // Pincode checker state
  const [pincode, setPincode] = useState('110001')
  const [pincodeStatus, setPincodeStatus] = useState({ checked: true, valid: true, city: 'Connaught Place, New Delhi', days: 'Tomorrow' })
  // Gift packaging (+99)
  const [addGiftBox, setAddGiftBox] = useState(false)
  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState({ code: 'MIRAAYA10', discountPct: 10, discountFlat: 0 })

  const partner = DELIVERY_PARTNERS.find(p => p.id === selectedPartner) || DELIVERY_PARTNERS[0]
  const partnerFee = (partner.freeThreshold > 0 && totalPrice >= partner.freeThreshold) ? 0 : partner.price

  // Coupon discount calculation
  let couponSavings = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountPct) {
      couponSavings = Math.round((totalPrice * appliedCoupon.discountPct) / 100)
    } else if (appliedCoupon.discountFlat) {
      couponSavings = appliedCoupon.discountFlat
    }
  }

  // Free shipping meter threshold (999)
  const freeThreshold = 999
  const freeShippingProgress = Math.min(100, Math.round((totalPrice / freeThreshold) * 100))
  const amountToFreeShipping = Math.max(0, freeThreshold - totalPrice)

  // Calculations
  const giftBoxFee = addGiftBox ? 99 : 0
  const subtotalAfterCoupon = Math.max(0, totalPrice - couponSavings)
  // 3% Jewellery GST
  const gstAmount = Math.round((subtotalAfterCoupon * 3) / 100)
  const grandTotal = subtotalAfterCoupon + partnerFee + giftBoxFee + gstAmount

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (!code) return

    if (code === 'MIRAAYA10') {
      setAppliedCoupon({ code: 'MIRAAYA10', discountPct: 10, discountFlat: 0 })
      toast.success('Coupon MIRAAYA10 applied! 10% discount deducted.')
      setCouponInput('')
    } else if (code === 'WELCOME100') {
      setAppliedCoupon({ code: 'WELCOME100', discountPct: 0, discountFlat: 100 })
      toast.success('Coupon WELCOME100 applied! ₹100 flat discount deducted.')
      setCouponInput('')
    } else if (code === 'SPARKLE') {
      if (totalPrice < 2500) {
        toast.error('Code SPARKLE is valid on orders above ₹2,500')
      } else {
        setAppliedCoupon({ code: 'SPARKLE', discountPct: 0, discountFlat: 250 })
        toast.success('Code SPARKLE applied! ₹250 instant off.')
        setCouponInput('')
      }
    } else {
      toast.error('Invalid coupon code. Try MIRAAYA10 or WELCOME100')
    }
  }

  const handleCheckPincode = (e) => {
    e.preventDefault()
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      toast.error('Please enter a valid 6-digit Indian PIN code')
      return
    }
    // NCR check
    if (pincode.startsWith('11') || pincode.startsWith('20') || pincode.startsWith('12')) {
      setPincodeStatus({ checked: true, valid: true, city: 'Delhi NCR Region', days: 'Today / Tomorrow' })
      toast.success('Same-day local delivery available for your area!')
    } else {
      setPincodeStatus({ checked: true, valid: true, city: 'Pan-India Express Zone', days: '2–3 Business Days' })
      toast.info('Express Air delivery available via Blue Dart & Delhivery')
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="cart-empty__icon-wrap">
          <FiShoppingBag size={48} style={{ color: 'var(--gold-dark)' }} />
        </div>
        <h2 className="cart-empty__title">Your Shopping Bag is Empty</h2>
        <p className="cart-empty__sub">Discover handcrafted royal Kundan, Polki, and bridal jewellery designed to elevate your style.</p>
        <Link to="/shop" className="btn btn-gold" style={{ marginTop: '12px' }}>
          <span>Explore Bestsellers</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      {/* ── Header ── */}
      <div className="cart-page__header">
        <button className="cart-back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Continue Shopping
        </button>
        <h1 className="cart-page__title">
          Shopping Bag <span className="cart-page__count">({items.reduce((s, i) => s + i.qty, 0)} pieces)</span>
        </h1>
      </div>

      {/* ── Free Express Shipping Meter (iOS Style) ── */}
      <div className="shipping-meter ios-card">
        <div className="shipping-meter__header">
          {amountToFreeShipping > 0 ? (
            <span>Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Blue Dart Express Delivery!</strong></span>
          ) : (
            <span className="shipping-meter__unlocked"><strong>Congratulations!</strong> You have unlocked <strong>FREE Express Shipping</strong></span>
          )}
          <span className="shipping-meter__pct">{freeShippingProgress}%</span>
        </div>
        <div className="shipping-meter__bar">
          <div className="shipping-meter__fill" style={{ width: `${freeShippingProgress}%` }} />
        </div>
      </div>

      <div className="cart-layout">
        {/* ── Left Column: Items & Delivery Preferences ── */}
        <div className="cart-main-col">
          {/* Items List */}
          <div className="cart-items">
            <div className="cart-items__header-bar ios-card">
              <span className="cart-section-title-text">Selected Heirlooms ({items.reduce((s, i) => s + i.qty, 0)})</span>
              <button className="cart-clear-all" onClick={clearCart}>Empty Bag</button>
            </div>

            {items.map(item => (
              <div className="cart-item ios-card" key={item.id}>
                <div className="cart-item__img-wrap">
                  <img src={item.image_url || `/images/products/${item.slug}.jpg`} alt={item.name} className="cart-item__img" />
                </div>
                <div className="cart-item__info">
                  <span className="cart-item__cat">{item.category}</span>
                  <Link to={`/product/${item.slug}`} className="cart-item__name">{item.name}</Link>
                  <div className="cart-item__pricing">
                    <span className="cart-item__current-price">₹{item.price?.toLocaleString('en-IN')}</span>
                    {item.mrp && item.mrp > item.price && (
                      <span className="cart-item__mrp">₹{item.mrp?.toLocaleString('en-IN')}</span>
                    )}
                    {item.mrp && item.mrp > item.price && (
                      <span className="cart-item__save-pill">Save ₹{(item.mrp - item.price).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="cart-item__controls">
                    <div className="cart-item__qty-pill">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                        <FiMinus size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                        <FiPlus size={13} />
                      </button>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} title="Remove item">
                      <FiTrash2 size={14} /> <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="cart-item__total">
                  <span className="cart-item__total-label">Subtotal</span>
                  <span className="cart-item__total-val">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Local Delivery Partner Selection (iOS Grouped List) ── */}
          <div className="delivery-partners-box ios-card">
            <div className="cart-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiTruck size={18} style={{ color: 'var(--gold-dark)' }} />
                <span>Select Delivery Partner</span>
              </span>
              <span className="cart-section-subtitle">Doorstep Tracking Included</span>
            </div>

            {/* Pincode Check input */}
            <form className="pincode-bar" onSubmit={handleCheckPincode}>
              <FiMapPin className="pincode-icon" size={16} />
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Enter 6-digit delivery PIN code..."
                className="pincode-input"
              />
              <button type="submit" className="pincode-btn">Check</button>
            </form>

            {pincodeStatus.checked && (
              <div className="pincode-result">
                <FiCheck size={14} style={{ color: 'var(--green)' }} />
                <span>Deliverable to <strong>{pincodeStatus.city}</strong> · Estimated Arrival: <strong>{pincodeStatus.days}</strong></span>
              </div>
            )}

            {/* Partner Radio Cards */}
            <div className="partner-options">
              {DELIVERY_PARTNERS.map(p => {
                const isSelected = selectedPartner === p.id
                const isFree = (p.freeThreshold > 0 && totalPrice >= p.freeThreshold) || p.price === 0
                return (
                  <label className={`partner-option ${isSelected ? 'partner-option--selected' : ''}`} key={p.id}>
                    <input
                      type="radio"
                      name="delivery_partner"
                      checked={isSelected}
                      onChange={() => setSelectedPartner(p.id)}
                      className="partner-option__radio"
                    />
                    <div className="partner-option__content">
                      <div className="partner-option__top">
                        <span className="partner-option__name">{p.name}</span>
                        <span className="partner-option__badge">{p.badge}</span>
                        <span className="partner-option__cost">
                          {isFree ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : `₹${p.price}`}
                        </span>
                      </div>
                      <div className="partner-option__sub">
                        <span>⏱️ Est: <strong>{p.estimate}</strong></span>
                        <span>·</span>
                        <span>{p.desc}</span>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* ── Luxury Gift Packaging Add-on ── */}
          <div className="gift-box-option ios-card">
            <label className="gift-box-label">
              <input
                type="checkbox"
                checked={addGiftBox}
                onChange={e => setAddGiftBox(e.target.checked)}
                className="gift-box-checkbox"
              />
              <div className="gift-box-text">
                <div className="gift-box-title">
                  <span>Add Royal Velvet Gift Packaging (+₹99)</span>
                  <span className="badge badge-gold">Keepsake Edition</span>
                </div>
                <p className="gift-box-desc">
                  Includes a plush emerald velvet jewellery case, gold-foiled bag, and personalized wax-sealed greeting letter.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Right Column: Transparent iOS Billing & Checkout ── */}
        <div className="cart-sidebar">
          {/* Coupon Code Drawer */}
          <div className="coupon-box ios-card">
            <div className="coupon-title">
              <FiTag size={16} style={{ color: 'var(--gold-dark)' }} />
              <span>Apply Promo & Gift Voucher</span>
            </div>
            {appliedCoupon ? (
              <div className="coupon-applied">
                <div>
                  <span className="coupon-applied__code">{appliedCoupon.code}</span>
                  <span className="coupon-applied__savings">Saved ₹{couponSavings.toLocaleString('en-IN')}</span>
                </div>
                <button className="coupon-remove" onClick={() => setAppliedCoupon(null)}>Remove</button>
              </div>
            ) : (
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="e.g. MIRAAYA10"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-btn">Apply</button>
              </form>
            )}
            <div className="coupon-hints">
              <span>Tap to use: </span>
              <button type="button" onClick={() => { setAppliedCoupon({ code: 'MIRAAYA10', discountPct: 10, discountFlat: 0 }); toast.success('MIRAAYA10 applied!'); }}>MIRAAYA10 (10% OFF)</button>
              <button type="button" onClick={() => { setAppliedCoupon({ code: 'WELCOME100', discountPct: 0, discountFlat: 100 }); toast.success('WELCOME100 applied!'); }}>WELCOME100 (₹100)</button>
            </div>
          </div>

          {/* Detailed Transparent Billing Summary */}
          <div className="cart-summary ios-card">
            <h2 className="cart-summary__title">Billing & Order Details</h2>
            <div className="billing-rows">
              <div className="billing-row">
                <span>Items Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {couponSavings > 0 && (
                <div className="billing-row billing-row--discount">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{couponSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              {addGiftBox && (
                <div className="billing-row">
                  <span>Luxury Velvet Packaging</span>
                  <span>+ ₹99</span>
                </div>
              )}

              <div className="billing-row">
                <span>
                  Delivery Partner ({partner.name.split(' ')[0]})
                </span>
                <span>
                  {partnerFee === 0 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : `₹${partnerFee}`}
                </span>
              </div>

              <div className="billing-row billing-row--tax">
                <span>Statutory 3% Jewellery GST</span>
                <span>+ ₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="billing-divider" />

              <div className="billing-row billing-row--total">
                <div>
                  <span className="billing-total-label">Total Payable</span>
                  <span className="billing-total-tax-note">Inclusive of 3% GST</span>
                </div>
                <span className="billing-total-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn btn-gold cart-checkout-btn"
              onClick={() => alert(`Order of ₹${grandTotal.toLocaleString('en-IN')} initiated! Proceeding to Payment Gateway.`)}
            >
              <span>Proceed to Secure Checkout</span>
            </button>

            {/* Payment Partner Logos & Badges */}
            <div className="payment-badges">
              <div className="payment-badges__title">Guaranteed Safe & Verified Checkout</div>
              <div className="payment-badges__grid">
                <span className="pay-pill">Google Pay</span>
                <span className="pay-pill">PhonePe</span>
                <span className="pay-pill">Cards (Visa/MC)</span>
                <span className="pay-pill">Apple Pay</span>
                <span className="pay-pill">Cash on Delivery</span>
              </div>
              <div className="security-note">
                <FiShield size={13} style={{ color: 'var(--green)' }} />
                <span>256-Bit Bank-Grade SSL Encryption · PCI-DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
