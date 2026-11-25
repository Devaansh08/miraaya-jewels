import React from 'react'
import { Link } from 'react-router-dom'
import './StaticPage.css'

export default function About() {
  return (
    <div className="static-page">
      <div className="static-page__hero" style={{ backgroundImage: 'url(/images/banner/brand-story.jpg)' }}>
        <div className="static-page__hero-overlay" />
        <div className="container static-page__hero-content">
          <h1 className="static-page__hero-title">About Miraaya Jewels</h1>
          <p className="static-page__hero-sub">More than jewellery — a chapter of your story</p>
        </div>
      </div>
      <div className="container static-page__body">
        <section className="about-section">
          <h2>Our Story</h2>
          <div className="divider" style={{ margin: '12px 0 24px' }} />
          <p>Miraaya Jewels was born from a simple belief: that every woman deserves jewellery that speaks to who she is — not just what she owns. We curate thoughtfully, source responsibly, and design for the woman who moves through life with grace and intention.</p>
          <p>From intricate Kundan sets that honour India's rich craft traditions to minimalist everyday rings that whisper elegance, our collection spans every chapter of life — because you deserve jewellery that grows with you.</p>
        </section>
        <section className="about-section">
          <h2>Our Values</h2>
          <div className="divider" style={{ margin: '12px 0 24px' }} />
          <div className="about-values">
            {[
              ['Craftsmanship', 'Every piece is handpicked for quality, detail, and longevity.'],
              ['Authenticity', 'Traditional Indian techniques meet modern aesthetics.'],
              ['Responsibility', 'We source ethically and package sustainably.'],
              ['Community', 'Built on trust with our customers, one piece at a time.']
            ].map(([t, d]) => (
              <div className="about-value-card" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/shop" className="btn btn-gold">Explore Our Collection</Link>
        </div>
      </div>
    </div>
  )
}

