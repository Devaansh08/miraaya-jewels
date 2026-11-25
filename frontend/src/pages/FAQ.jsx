import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSearch, FiChevronDown, FiTruck, FiCreditCard, FiShield,
  FiRefreshCw, FiPhone, FiMessageCircle, FiCheck, FiX
} from 'react-icons/fi'
import './StaticPage.css'

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'delivery', label: 'Local Delivery' },
  { id: 'billing', label: 'Billing & Taxes' },
  { id: 'authenticity', label: 'Authenticity & Quality' },
  { id: 'care', label: 'Care & Storage' },
  { id: 'returns', label: 'Returns & Refunds' },
]

const ALL_FAQS = [
  // ── Delivery
  {
    cat: 'delivery',
    badge: 'Same-Day',
    q: 'How does Local Same-Day Delivery work in Delhi NCR?',
    a: 'For Delhi, Gurugram, Noida, and Faridabad pin codes, any order confirmed before 1:00 PM IST is hand-dispatched via our local express couriers (Shiprocket/Dunzo). A direct live GPS tracking link with your delivery partner’s contact is shared via WhatsApp & SMS. Delivery is completed the same evening between 4:00 PM and 8:00 PM.'
  },
  {
    cat: 'delivery',
    badge: 'Express Air',
    q: 'What local delivery partners do you use across India?',
    a: 'We partner with Blue Dart Air Express for tier-1 and metro cities (guaranteed 24–48 hours transit) and Delhivery Surface/Air for pan-India coverage across 19,000+ PIN codes. All parcels are fully transit-insured and require an OTP at doorstep handoff for maximum security.'
  },
  {
    cat: 'delivery',
    badge: 'Free Shipping',
    q: 'What are the delivery charges and free shipping limits?',
    a: 'Standard Delhivery shipping is 100% FREE on all prepaid orders. Blue Dart Air Express is completely FREE on orders above ₹999 (flat ₹99 for smaller orders). Local NCR Same-Day delivery is free above ₹1,999 (flat ₹149 below that).'
  },
  {
    cat: 'delivery',
    badge: 'Tamper-Proof',
    q: 'How is the jewellery packaged during transit?',
    a: 'Every piece is nestled in an anti-tarnish velvet keepsake box, wrapped in shock-absorbent eco-cushioning, and placed inside a tamper-evident, sealed security polybag. If the exterior seal appears breached upon arrival, do not accept the package and notify us immediately.'
  },

  // ── Billing
  {
    cat: 'billing',
    badge: '3% GST',
    q: 'How is the 3% Jewellery GST calculated on my bill?',
    a: 'Under Indian GST laws (HSN Code 7113/7117), imitation and fashion jewellery attracts a mandatory 3% Goods and Services Tax. Unlike stores that hide taxes in inflated prices, Miraaya Jewels provides a 100% transparent itemized tax invoice: Base Price, Applicable Discount, 3% GST, and Delivery Fee. A digital GST invoice is emailed immediately upon order placement.'
  },
  {
    cat: 'billing',
    badge: 'Promo Codes',
    q: 'How do coupon codes like MIRAAYA10 work on checkout?',
    a: 'Simply enter your coupon code in the Promo Code field in your bag. The discount (e.g., 10% off with MIRAAYA10 or ₹100 off with WELCOME100) is deducted instantly from your item subtotal before the statutory 3% tax is calculated, saving you maximum money.'
  },
  {
    cat: 'billing',
    badge: 'Payment Modes',
    q: 'What payment options are supported?',
    a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ banks, Apple Pay, and Cash on Delivery (COD) for orders up to ₹5,000. All online transactions are processed through 256-bit bank-grade SSL encrypted gateways.'
  },
  {
    cat: 'billing',
    badge: 'Cash on Delivery',
    q: 'Are there extra charges for Cash on Delivery (COD)?',
    a: 'COD is available for select PIN codes. To minimize bogus orders, an automated 1-click WhatsApp or SMS verification is performed before dispatch. COD carries no extra surcharge on orders above ₹999.'
  },

  // ── Authenticity
  {
    cat: 'authenticity',
    badge: 'Certified',
    q: 'Are Miraaya pieces authentic and certified?',
    a: 'Yes. Our jewellery features high-grade brass and copper alloys with micro-plated 22K yellow and antique gold finishes. We use hand-cut semi-precious Kundan glass stones, real freshwater and shell pearls, and authentic Meenakari enamel art crafted by master artisans in Jaipur.'
  },
  {
    cat: 'authenticity',
    badge: 'Skin Friendly',
    q: 'Is the jewellery safe for sensitive skin?',
    a: 'Absolutely. Every piece is strictly 100% lead-free, nickel-free, and cadmium-free, meeting European REACH skin safety compliance. They are coated with an invisible anti-allergic protective lacquer to prevent rashes or discoloration.'
  },

  // ── Care
  {
    cat: 'care',
    badge: 'Care Guide',
    q: 'How do I care for my Kundan & gold finish jewellery?',
    a: 'Keep your jewellery away from direct contact with water, perfume, deodorants, and hairspray (wear jewellery last when getting ready). After wearing, gently wipe with the complimentary microfibre cloth provided in your box and store in your Miraaya zip-pouch in a cool, dry place.'
  },

  // ── Returns
  {
    cat: 'returns',
    badge: '7-Day Guarantee',
    q: 'What is your returns and doorstep exchange policy?',
    a: 'We offer an unconditional 7-day return and exchange window from the delivery date. If you wish to return or exchange an item, simply visit our Track/Cancel Order page or message our WhatsApp concierge. Our local courier partner will pick up the parcel from your doorstep at zero charge to you.'
  },
  {
    cat: 'returns',
    badge: 'Instant Refund',
    q: 'How quickly is my refund processed?',
    a: 'Once the pickup courier scans the return parcel, your refund is approved within 24 hours and credited directly back to your original payment method or instant UPI ID.'
  }
]

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Filter FAQs based on active category tab & search query
  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter(faq => {
      const matchesTab = activeTab === 'all' || faq.cat === activeTab
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.badge.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [activeTab, searchQuery])

  return (
    <div className="faq-page">
      {/* ── iOS Style Header ── */}
      <div className="ios-faq-hero">
        <div className="container">
          <div className="ios-faq-pill">MIRAAYA CONCIERGE &amp; HELP</div>
          <h1 className="ios-faq-title">How Can We Help You?</h1>
          <p className="ios-faq-sub">
            Clear, transparent details about our local NCR delivery partners, statutory 3% jewellery billing, BIS quality, and easy returns.
          </p>

          {/* iOS Cupertino Search Bar */}
          <div className="ios-search-bar">
            <FiSearch className="ios-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search local delivery, 3% GST billing, Kundan care, Blue Dart..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ios-search-input"
            />
            {searchQuery && (
              <button className="ios-search-clear" onClick={() => setSearchQuery('')}>
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container ios-faq-container">
        {/* ── iOS Segmented Category Control ── */}
        <div className="ios-category-pills">
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`ios-cat-pill ${activeTab === cat.id ? 'ios-cat-pill--active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ── Inset Grouped FAQ List (iOS Settings Aesthetic) ── */}
        <div className="ios-faq-card">
          <div className="ios-faq-card__header">
            <span className="ios-faq-card__title">
              {activeTab === 'all' ? 'All Frequently Asked Questions' : FAQ_CATEGORIES.find(c => c.id === activeTab)?.label}
            </span>
            <span className="ios-faq-card__count">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'topic' : 'topics'} found
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="ios-faq-empty">
              <FiSearch size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
              <h3>No matching questions found</h3>
              <p>Try searching for terms like "delivery", "GST", "billing", or "returns".</p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="ios-faq-list">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = !!openItems[idx]
                return (
                  <div className={`ios-faq-row ${isOpen ? 'ios-faq-row--open' : ''}`} key={idx}>
                    <button
                      className="ios-faq-row__question"
                      onClick={() => toggleItem(idx)}
                      aria-expanded={isOpen}
                    >
                      <div className="ios-faq-row__q-left">
                        <span className="ios-faq-badge">{faq.badge}</span>
                        <span className="ios-faq-question-text">{faq.q}</span>
                      </div>
                      <div className={`ios-chevron ${isOpen ? 'ios-chevron--rotated' : ''}`}>
                        <FiChevronDown size={18} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="ios-faq-row__answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Direct Concierge Support Card (iOS style) ── */}
        <div className="ios-support-card">
          <div className="ios-support-card__left">
            <span className="ios-support-pill">24/7 LIVE CONCIERGE</span>
            <h3 className="ios-support-title">Still have questions about your jewellery or custom order?</h3>
            <p className="ios-support-sub">
              Our master jewellery stylists in Delhi NCR are available on WhatsApp and phone to assist with sizing, styling, and order delivery.
            </p>
          </div>
          <div className="ios-support-card__actions">
            <a
              href="https://wa.me/918076428336?text=Hi%20Miraaya%20Jewels,%20I%20have%20a%20question%20about%20my%20order."
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold ios-support-btn"
            >
              <FiMessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>
            <a href="tel:8076428336" className="btn btn-outline ios-support-btn">
              <FiPhone size={17} />
              <span>Call +91 80764 28336</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
