import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiShield } from 'react-icons/fi'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: true })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (!form.terms) {
      toast.error('Please accept the membership terms')
      return
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Welcome to Miraaya Jewels VIP Club! Your 10% coupon is MIRAAYA10')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialRegister = (provider) => {
    toast.info(`Connecting with ${provider}... Redirecting to secure verification.`)
  }

  return (
    <div className="auth-page">
      <div className="auth-card ios-card">
        {/* iOS Segmented Pill Switcher */}
        <div className="ios-segmented-control">
          <Link to="/login" className="ios-segment-btn">Sign In</Link>
          <button className="ios-segment-btn ios-segment-btn--active">Create Account</button>
        </div>

        <div className="auth-brand">
          <div className="auth-brand__crown">
            <FiShield size={24} style={{ color: 'var(--gold-dark)' }} />
          </div>
          <span className="auth-brand__name">Miraaya Jewels</span>
          <span className="auth-brand__tag">Unlock Royalty &amp; Exclusive Pricing</span>
        </div>

        <h1 className="auth-title">Join Miraaya Club</h1>
        <p className="auth-sub">Enjoy complimentary gift packaging, birthday treats, and express checkout.</p>

        {/* ── Social Register Buttons ── */}
        <div className="social-auth-group">
          <button
            type="button"
            className="social-auth-btn social-auth-btn--apple"
            onClick={() => handleSocialRegister('Apple ID')}
          >
            <span>Sign up with Apple</span>
          </button>
          <button
            type="button"
            className="social-auth-btn social-auth-btn--google"
            onClick={() => handleSocialRegister('Google')}
          >
            <span>Sign up with Google</span>
          </button>
        </div>

        <div className="auth-divider-line">
          <span>or create with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <FiUser className="auth-field-icon" size={17} />
              <input
                type="text"
                className="auth-input"
                placeholder="Priya Sharma"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-field-icon" size={17} />
              <input
                type="email"
                className="auth-input"
                placeholder="priya@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-field-icon" size={17} />
              <input
                type={showPass ? 'text' : 'password'}
                className="auth-input"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
              />
              <button
                type="button"
                className="auth-toggle-pass"
                onClick={() => setShowPass(s => !s)}
                aria-label="Toggle password"
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-field-icon" size={17} />
              <input
                type="password"
                className="auth-input"
                placeholder="Confirm your password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>
          </div>

          <label className="auth-terms-label">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
              style={{ accentColor: 'var(--gold-dark)', marginTop: '3px' }}
            />
            <span className="auth-terms-text">
              I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
            <span>{loading ? 'Creating VIP Profile…' : 'Join Miraaya VIP Club'}</span>
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          Already a member? <Link to="/login">Sign In Here</Link>
        </p>
      </div>
    </div>
  )
}
