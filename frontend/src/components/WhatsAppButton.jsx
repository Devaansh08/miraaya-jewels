import React, { useState, useEffect, useRef } from 'react'
import { FiX, FiMessageCircle, FiBriefcase, FiHelpCircle, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './WhatsAppButton.css'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)
  const phone = '918076428336'

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside)
    }
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  const openWhatsApp = (type = 'general') => {
    let msg = 'Hello Miraaya Jewels! I have an inquiry regarding your royal jewellery collection.'
    if (type === 'business') {
      msg = 'Hello Miraaya Jewels Team! I would like to inquire about business collaboration, wholesale, or bulk gifting orders.'
    } else if (type === 'support') {
      msg = 'Hello Miraaya Jewels! I need assistance with product styling, custom bridal orders, or delivery tracking.'
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div className="whatsapp-widget" ref={popupRef}>
      {/* Floating Action Pill / Button */}
      <button
        className="whatsapp-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp with Miraaya Jewels"
        title="WhatsApp Query & Business Help"
        type="button"
      >
        <span className="whatsapp-pulse-ring" />
        <FaWhatsapp className="whatsapp-icon" size={26} />
        <span className="whatsapp-float-label">Chat &amp; Inquire</span>
      </button>

      {/* Interactive Quick Contact Card */}
      {isOpen && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup__header">
            <div className="whatsapp-popup__brand">
              <div className="whatsapp-popup__avatar">
                <FaWhatsapp size={22} />
              </div>
              <div>
                <h4 className="whatsapp-popup__title">Miraaya Jewels Concierge</h4>
                <p className="whatsapp-popup__status">
                  <span className="status-dot" /> Online · Typically replies in &lt;15 mins
                </p>
              </div>
            </div>
            <button
              className="whatsapp-popup__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp card"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="whatsapp-popup__body">
            <p className="whatsapp-popup__greeting">
              Namaste! 🙏 Welcome to Miraaya Jewels. How can our royal jewellery stylists assist you today?
            </p>

            <div className="whatsapp-popup__options">
              {/* Option 1: Product & Styling Query */}
              <button
                className="whatsapp-opt-card"
                onClick={() => openWhatsApp('support')}
                type="button"
              >
                <div className="whatsapp-opt-icon">
                  <FiHelpCircle size={18} />
                </div>
                <div className="whatsapp-opt-text">
                  <strong>Jewellery Inquiry &amp; Styling 💬</strong>
                  <span>Sizing, custom bridal sets, express delivery</span>
                </div>
                <FiChevronRight className="whatsapp-opt-arrow" size={16} />
              </button>

              {/* Option 2: Business & Wholesale */}
              <button
                className="whatsapp-opt-card whatsapp-opt-card--business"
                onClick={() => openWhatsApp('business')}
                type="button"
              >
                <div className="whatsapp-opt-icon">
                  <FiBriefcase size={18} />
                </div>
                <div className="whatsapp-opt-text">
                  <strong>Business &amp; Bulk Orders 💼</strong>
                  <span>Wholesale catalog, corporate &amp; boutique orders</span>
                </div>
                <FiChevronRight className="whatsapp-opt-arrow" size={16} />
              </button>
            </div>
          </div>

          <div className="whatsapp-popup__footer">
            <div className="whatsapp-popup__phone">
              <span>Direct WhatsApp: </span>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noreferrer"
              >
                +91 80764 28336
              </a>
            </div>
            <button
              className="whatsapp-popup__start-btn"
              onClick={() => openWhatsApp('general')}
              type="button"
            >
              <FaWhatsapp size={16} />
              <span>Start WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
