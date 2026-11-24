import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiInstagram, FiFacebook, FiYoutube, FiPhone, FiMail,
  FiMapPin, FiTruck, FiShield, FiCreditCard, FiAward, FiClock
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* ── Footer Top Trust Pill Strip ── */}
      <div className="footer__trust-strip">
        <div className="container">
          <div className="footer__trust-grid">
            <div className="footer__trust-pill">
              <span className="footer__trust-emoji">⚡</span>
              <div className="footer__trust-text">
                <strong>Blue Dart Air & Local NCR 🛵</strong>
                <span>Priority express delivery with live tracking</span>
              </div>
            </div>
            <div className="footer__trust-pill">
              <span className="footer__trust-emoji">💎</span>
              <div className="footer__trust-text">
                <strong>100% Certified 22K Finish 👑</strong>
                <span>Lead-free & hypoallergenic craftsmanship</span>
              </div>
            </div>
            <div className="footer__trust-pill">
              <span className="footer__trust-emoji">🔄</span>
              <div className="footer__trust-text">
                <strong>7-Day Free Pickup Returns 📦</strong>
                <span>Instant refund & hassle-free exchange</span>
              </div>
            </div>
            <div className="footer__trust-pill">
              <span className="footer__trust-emoji">📜</span>
              <div className="footer__trust-text">
                <strong>3% GST Transparent Billing 💳</strong>
                <span>No hidden costs · Itemized digital invoice</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__top">
            {/* Brand Column */}
            <div className="footer__col footer__col--brand">
              <div className="footer__logo">
                <span className="footer__logo-name">Miraaya</span>
                <span className="footer__logo-sub">JEWELS</span>
              </div>
              <p className="footer__tagline">
                Thoughtfully selected fashion jewellery for every chapter of you ✨
                Handcrafted with royal heritage traditions, modern elegance, and transparent care.
              </p>
              <div className="footer__social">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <FiYoutube />
                </a>
              </div>

              <div className="footer__badge-list">
                <span className="f-badge">👑 Handcrafted in India</span>
                <span className="f-badge">✨ 10,000+ Happy Queens</span>
              </div>
            </div>

            {/* Categories (with icons/emojis in footer as requested) */}
            <div className="footer__col">
              <h4 className="footer__heading">
                <span>🛍️</span> Shop Categories
              </h4>
              <ul className="footer__links">
                <li><Link to="/shop">✨ Shop All Jewellery</Link></li>
                <li><Link to="/shop?category=Necklaces">📿 Necklaces & Sets</Link></li>
                <li><Link to="/shop?category=Rings">💍 Cocktail & Band Rings</Link></li>
                <li><Link to="/shop?category=Bangles">✨ Royal Kundan Bangles</Link></li>
                <li><Link to="/shop?category=Earrings">💎 Jhumkas & Chandbalis</Link></li>
                <li><Link to="/shop?category=Hair Accessories">👑 Bridal Passa & Tikkas</Link></li>
                <li><Link to="/shop?category=Watches">⌚ Jewelled Cuff Watches</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer__col">
              <h4 className="footer__heading">
                <span>📋</span> Quick & Helpful Links
              </h4>
              <ul className="footer__links">
                <li><Link to="/about">📖 Our Story & Legacy</Link></li>
                <li><Link to="/track-order">📦 Track Your Order</Link></li>
                <li><Link to="/cancel-order">🚫 Cancel Order Request</Link></li>
                <li><Link to="/faq">💬 Help & FAQ Guide</Link></li>
                <li><Link to="/shipping-policy">🚚 Shipping & Delivery Rates</Link></li>
                <li><Link to="/returns">🔄 7-Day Returns & Exchanges</Link></li>
                <li><Link to="/privacy-policy">🔒 Privacy & Data Policy</Link></li>
                <li><Link to="/terms">📜 Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact & Local Studio */}
            <div className="footer__col">
              <h4 className="footer__heading">
                <span>📞</span> Concierge & Studio
              </h4>
              <ul className="footer__contact">
                <li>
                  <FiPhone size={15} style={{ color: 'var(--gold)' }} />
                  <a href="tel:8076428336">+91 80764 28336</a>
                </li>
                <li>
                  <FaWhatsapp size={15} style={{ color: '#25D366' }} />
                  <a
                    href="https://wa.me/918076428336?text=Hello%20Miraaya%20Jewels!%20I%20have%20an%20inquiry%20regarding%20jewellery%20or%20business%20orders."
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#25D366', fontWeight: 600 }}
                  >
                    WhatsApp Chat &amp; Business
                  </a>
                </li>
                <li>
                  <FiMail size={15} style={{ color: 'var(--gold)' }} />
                  <a href="mailto:divyaguptamt@gmail.com">divyaguptamt@gmail.com</a>
                </li>
                <li>
                  <FiMapPin size={15} style={{ color: 'var(--gold)' }} />
                  <span>Delhi NCR Studio, India 🇮🇳</span>
                </li>
                <li>
                  <FiClock size={15} style={{ color: 'var(--gold)' }} />
                  <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
                </li>
              </ul>

              <div className="footer__gstin-card">
                <span className="footer__gstin-label">Registered Business Entity</span>
                <span className="footer__gstin-val">Miraaya Jewels · Delhi NCR</span>
                <span className="footer__gstin-sub">GSTIN: [PENDING CLIENT CONFIRMATION]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Payment & Partner Badges ── */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">
              © {year} Miraaya Jewels. All rights reserved · Timeless Elegance.
            </p>

            <div className="footer__payment-partners">
              <span className="f-pay-tag">📱 UPI / GPay</span>
              <span className="f-pay-tag">🟣 PhonePe</span>
              <span className="f-pay-tag">💳 Cards (Visa/MC)</span>
              <span className="f-pay-tag">⚡ Blue Dart</span>
              <span className="f-pay-tag">🚚 Delhivery</span>
              <span className="f-pay-tag">🔒 256-Bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
