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
      <div className="auth-card">
        {/* Authentic Brand Header */}
        <Link to="/" className="auth-brand" aria-label="Miraaya Jewels Home">
          <span className="auth-brand__name">Miraaya</span>
          <span className="auth-brand__sub">JEWELS</span>
          <span className="auth-brand__tag">Royal Club &amp; Concierge</span>
        </Link>
        <div className="divider" style={{ margin: '14px auto 22px' }} />

        {/* Royal Luxury Tabs */}
        <div className="auth-tabs">
          <span className="auth-tab auth-tab--active">Sign In</span>
          <Link to="/register" className="auth-tab">Create Account</Link>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Access your saved heirlooms, personalized styling, and member-only rewards.</p>

        {/* ── Social Login Buttons ── */}
        <div className="social-auth-group">
          <button
            type="button"
            className="social-auth-btn"
            onClick={() => handleSocialLogin('Apple ID')}
          >
            <FiShield size={15} className="social-auth-icon" />
            <span>Continue with Apple</span>
          </button>
          <button
            type="button"
            className="social-auth-btn"
            onClick={() => handleSocialLogin('Google')}
          >
            <FiShield size={15} className="social-auth-icon" />
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

          <div className="auth-remember-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                className="auth-checkbox"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
            <span>{loading ? 'Verifying Account…' : 'Sign In to Bag & Orders'}</span>
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        {/* Member Benefits Footer */}
        <div className="auth-benefits">
          <span>Same-Day NCR Tracking</span>
          <span>·</span>
          <span>10% Off First Order</span>
          <span>·</span>
          <span>VIP Festive Drops</span>
        </div>

        <p className="auth-switch">
          New to Miraaya? <Link to="/register">Create VIP Account</Link>
        </p>
      </div>
    </div>
  )
}
