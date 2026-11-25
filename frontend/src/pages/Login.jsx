import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back to Miraaya Jewels!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    toast.info(`Connecting via ${provider}... Redirecting to secure OAuth.`)
  }

  return (
    <div className="auth-page">
      <div className="auth-card ios-card">
        {/* iOS Segmented Pill Switcher */}
        <div className="ios-segmented-control">
          <button className="ios-segment-btn ios-segment-btn--active">Sign In</button>
          <Link to="/register" className="ios-segment-btn">Create Account</Link>
        </div>

        <div className="auth-brand">
          <div className="auth-brand__crown">
            <FiShield size={24} style={{ color: 'var(--gold-dark)' }} />
          </div>
          <span className="auth-brand__name">Miraaya Jewels</span>
          <span className="auth-brand__tag">Royal Club &amp; Order Concierge</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Access your orders, saved heirlooms, and member-only festive prices.</p>

        {/* ── Social Login Buttons (Apple & Google) ── */}
        <div className="social-auth-group">
          <button
            type="button"
            className="social-auth-btn social-auth-btn--apple"
            onClick={() => handleSocialLogin('Apple ID')}
          >
            <span>Continue with Apple</span>
          </button>
          <button
            type="button"
            className="social-auth-btn social-auth-btn--google"
            onClick={() => handleSocialLogin('Google')}
          >
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="auth-divider-line">
          <span>or sign in with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-field-icon" size={17} />
              <input
                type="email"
                className="auth-input"
                placeholder="queen@miraayajewels.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-field-top">
              <label className="auth-label">Password</label>
              <Link to="/faq" className="auth-forgot-link">Forgot password?</Link>
            </div>
            <div className="auth-input-wrap">
              <FiLock className="auth-field-icon" size={17} />
              <input
                type={showPass ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
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

          {/* iOS Toggle Switch */}
          <div className="ios-switch-row">
            <label className="ios-switch-label">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                className="ios-switch-input"
              />
              <span className="ios-switch-slider" />
              <span className="ios-switch-text">Remember me on this device</span>
            </label>
          </div>

          <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
            <span>{loading ? 'Verifying Account…' : 'Sign In to Bag & Orders'}</span>
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        {/* Member Benefits Footer */}
        <div className="auth-benefits">
          <div className="auth-benefit-item">
            <span>Same-Day NCR Tracking</span>
          </div>
          <div className="auth-benefit-item">
            <span>10% Off First Purchase</span>
          </div>
          <div className="auth-benefit-item">
            <span>Exclusive VIP Drops</span>
          </div>
        </div>

        <p className="auth-switch">
          New to Miraaya? <Link to="/register">Create VIP Account</Link>
        </p>
      </div>
    </div>
  )
}
