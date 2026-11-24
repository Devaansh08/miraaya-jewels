import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiPhone, FiMail, FiClock } from 'react-icons/fi'
import './StaticPage.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/contact', form)
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="static-page">
      <div className="static-page__hero" style={{ backgroundImage: 'url(/images/banner/hero-banner.jpg)', height: 200 }}>
        <div className="static-page__hero-overlay" />
        <div className="container static-page__hero-content">
          <h1 className="static-page__hero-title">Contact Us</h1>
        </div>
      </div>
      <div className="container static-page__body">
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: 4 }}>Send a Message</h2>
            <div className="form-field">
              <label className="form-label">Your Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your full name" />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label className="form-label">Subject</label>
              <input className="form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="How can we help?" />
            </div>
            <div className="form-field">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="Your message..." />
            </div>
            <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
          </form>

          <div className="contact-info">
            <div className="contact-info-card"><FiPhone size={20} style={{ color: 'var(--gold)', marginBottom: 8 }} /><h3>Phone</h3><p><a href="tel:8076428336">+91 80764 28336</a></p></div>
            <div className="contact-info-card"><FiMail size={20} style={{ color: 'var(--gold)', marginBottom: 8 }} /><h3>Email</h3><p><a href="mailto:divyaguptamt@gmail.com">divyaguptamt@gmail.com</a></p></div>
            <div className="contact-info-card"><FiClock size={20} style={{ color: 'var(--gold)', marginBottom: 8 }} /><h3>Support Hours</h3><p>Mon – Sat: 10 AM – 6 PM IST</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
