import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import './StaticPage.css'

export function TrackOrder() {
  const [form, setForm] = useState({ order: '', email: '' })
  const [result, setResult] = useState(null)
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/orders/track', form)
      setResult(data)
    } catch {
      toast.error('Order not found. Check your order ID and email.')
    }
  }
  return (
    <div className="static-page container" style={{ paddingTop: 60 }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: 8 }}>Track Your Order</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Enter your order ID and email address to get real-time status.</p>
      <form className="track-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Order ID</label>
          <input className="form-input" placeholder="e.g. MJ-173242" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} required />
        </div>
        <div className="form-field">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <button type="submit" className="btn btn-gold">Track Order</button>
      </form>
      {result && (
        <div style={{ marginTop: 32, padding: 24, background: 'var(--cream)', borderRadius: 'var(--radius-md)' }}>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Tracking Number:</strong> {result.tracking_number || 'Will be assigned upon dispatch'}</p>
          <p><strong>Last Update:</strong> {result.last_update}</p>
        </div>
      )}
    </div>
  )
}

export function CancelOrder() {
  const [form, setForm] = useState({ order: '', email: '', reason: '' })
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/api/orders/cancel', form)
      toast.success('Cancellation request submitted. We\'ll process within 24 hours.')
      setForm({ order: '', email: '', reason: '' })
    } catch {
      toast.error('Could not find this order. Please contact support.')
    }
  }
  return (
    <div className="static-page container" style={{ paddingTop: 60 }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: 8 }}>Cancel an Order</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Orders can be cancelled within 12 hours of placing. After dispatch, please use the Returns process.</p>
      <form className="track-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Order ID</label>
          <input className="form-input" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} required />
        </div>
        <div className="form-field">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div className="form-field">
          <label className="form-label">Reason for cancellation</label>
          <textarea className="form-textarea" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
        </div>
        <button type="submit" className="btn btn-gold">Submit Cancellation</button>
      </form>
    </div>
  )
}

const PolicyPage = ({ title, children }) => (
  <div className="static-page container" style={{ paddingTop: 60, paddingBottom: 80 }}>
    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: 36 }}>{title}</h1>
    {children}
  </div>
)

export function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping Policy">
      <div className="policy-section">
        <h2>Delivery Times</h2>
        <ul>
          <li>Standard shipping: 5–7 business days</li>
          <li>Express shipping: 2–3 business days</li>
          <li>Same-day delivery: Available in select Delhi NCR areas</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>Free Shipping</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          Free standard shipping is available on all orders above ₹999. Orders below ₹999 incur a flat charge of ₹99.
        </p>
      </div>
      <div className="policy-section">
        <h2>Packaging</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          All Miraaya Jewels are shipped in our signature ivory gift boxes with complimentary tissue paper and a care card. Perfect for gifting — no extra charge.
        </p>
      </div>
    </PolicyPage>
  )
}

export function Returns() {
  return (
    <PolicyPage title="Returns & Exchanges">
      <div className="policy-section">
        <h2>Return Window</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          We offer a 7-day return and exchange policy from the date of delivery. Items must be unused, undamaged, and in their original packaging.
        </p>
      </div>
      <div className="policy-section">
        <h2>How to Return</h2>
        <ul>
          <li>Visit our Cancel/Return page and fill in your order number</li>
          <li>Our team will schedule a free pickup within 48 hours</li>
          <li>Refund is processed within 5–7 business days after quality check</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>Non-Returnable Items</h2>
        <ul>
          <li>Customised or personalised jewellery</li>
          <li>Items purchased during clearance sales</li>
          <li>Earrings (for hygiene reasons, unless defective)</li>
        </ul>
      </div>
    </PolicyPage>
  )
}

export function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy">
      <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: 24 }}>
        Last updated: November 2025. Miraaya Jewels is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data.
      </p>
      <div className="policy-section">
        <h2>Data We Collect</h2>
        <ul>
          <li>Name, email, phone number, and delivery address when you place an order</li>
          <li>Payment information (processed securely by Razorpay — we never store card details)</li>
          <li>Browsing behaviour to improve your experience</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>How We Use Your Data</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To send order confirmations and shipping updates</li>
          <li>To send promotional emails (you can unsubscribe anytime)</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>Contact</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          For privacy concerns, email us at <a href="mailto:divyaguptamt@gmail.com" style={{ color: 'var(--gold)' }}>divyaguptamt@gmail.com</a>.
        </p>
      </div>
    </PolicyPage>
  )
}

export function Terms() {
  return (
    <PolicyPage title="Terms & Conditions">
      <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: 24 }}>
        By using the Miraaya Jewels website, you agree to these terms. Please read them carefully.
      </p>
      <div className="policy-section">
        <h2>Use of Website</h2>
        <ul>
          <li>You must be 18+ to place orders on this site</li>
          <li>All product descriptions and prices are subject to change without notice</li>
          <li>We reserve the right to cancel any order that appears fraudulent</li>
        </ul>
      </div>
      <div className="policy-section">
        <h2>Intellectual Property</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          All content, images, and branding on this website are the property of Miraaya Jewels and may not be reproduced without written consent.
        </p>
      </div>
      <div className="policy-section">
        <h2>Governing Law</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
          These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Delhi.
        </p>
      </div>
    </PolicyPage>
  )
}

export function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 40 }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', color: 'var(--gold)' }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-gold">Go Home</Link>
    </div>
  )
}

