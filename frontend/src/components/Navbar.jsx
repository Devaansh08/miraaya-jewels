import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import {
  FiSearch, FiHeart, FiShoppingBag, FiUser, FiX, FiMenu, FiChevronDown
} from 'react-icons/fi'
import './Navbar.css'

const categories = [
  { name: 'Necklaces', slug: 'Necklaces' },
  { name: 'Rings', slug: 'Rings' },
  { name: 'Bangles', slug: 'Bangles' },
  { name: 'Earrings', slug: 'Earrings' },
  { name: 'Hair Accessories', slug: 'Hair Accessories' },
  { name: 'Watches', slug: 'Watches' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const { items: wl } = useWishlist()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userDropdown, setUserDropdown] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const searchRef = useRef(null)
  const catTimeout = useRef(null)
  const userTimeout = useRef(null)

  const handleCatEnter = () => {
    if (catTimeout.current) clearTimeout(catTimeout.current)
    setCatDropdown(true)
  }
  const handleCatLeave = () => {
    catTimeout.current = setTimeout(() => setCatDropdown(false), 140)
  }

  const handleUserEnter = () => {
    if (userTimeout.current) clearTimeout(userTimeout.current)
    setUserDropdown(true)
  }
  const handleUserLeave = () => {
    userTimeout.current = setTimeout(() => setUserDropdown(false), 140)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__item">
            <span>Special Offer: Use code <strong>MIRAAYA10</strong> for 10% OFF</span>
          </div>
          <div className="topbar__divider" />
          <div className="topbar__item">
            <span>Same-Day Local Delivery in Delhi NCR · Free Shipping Over ₹999</span>
          </div>
          <div className="topbar__divider" />
          <div className="topbar__item">
            <span>100% Certified 22K Gold Finish · Handcrafted Heirlooms</span>
          </div>
        </div>
      </div>

      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Mobile hamburger */}
          <button className="navbar__hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <FiMenu size={22} />
          </button>

          {/* Real Authentic Logo — strictly clean brand identity */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">Miraaya</span>
            <span className="navbar__logo-sub">JEWELS</span>
          </Link>

          {/* Main Desktop Nav (Clean, No Emojis/Icons as requested) */}
          <nav className="navbar__nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Shop
            </NavLink>

            {/* Categories Dropdown with seamless hover bridge */}
            <div
              className={`nav-dropdown ${catDropdown ? 'nav-dropdown--open' : ''}`}
              onMouseEnter={handleCatEnter}
              onMouseLeave={handleCatLeave}
            >
              <button
                className="nav-link nav-link--btn"
                onClick={() => setCatDropdown(prev => !prev)}
                type="button"
              >
                <span>Categories</span>
                <FiChevronDown size={14} className={`dropdown-chevron ${catDropdown ? 'dropdown-chevron--open' : ''}`} />
              </button>

              <div className="nav-dropdown__menu">
                <Link to="/shop" className="nav-dropdown__item nav-dropdown__item--all" onClick={() => setCatDropdown(false)}>
                  View All Categories →
                </Link>
                {categories.map(c => (
                  <Link
                    key={c.slug}
                    to={`/shop?category=${encodeURIComponent(c.slug)}`}
                    className="nav-dropdown__item"
                    onClick={() => setCatDropdown(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <a href="/#occasion" className="nav-link">
              Collections
            </a>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              About Us
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              FAQ
            </NavLink>
          </nav>

          {/* User & Bag Icons */}
          <div className="navbar__icons">
            <button className="icon-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
              <FiSearch size={19} />
            </button>

            <Link to="/wishlist" className="icon-btn icon-btn--badge" aria-label="Wishlist">
              <FiHeart size={19} />
              {wl.length > 0 && <span className="icon-badge">{wl.length}</span>}
            </Link>

            <Link to="/cart" className="icon-btn icon-btn--badge" aria-label="Cart">
              <FiShoppingBag size={19} />
              {totalItems > 0 && <span className="icon-badge icon-badge--pulse">{totalItems}</span>}
            </Link>

            {/* Account Dropdown */}
            <div
              className={`nav-dropdown ${userDropdown ? 'nav-dropdown--open' : ''}`}
              onMouseEnter={handleUserEnter}
              onMouseLeave={handleUserLeave}
            >
              <button
                className="icon-btn icon-btn--account"
                aria-label="Account"
                onClick={() => setUserDropdown(prev => !prev)}
                type="button"
              >
                <FiUser size={19} />
              </button>

              <div className="nav-dropdown__menu nav-dropdown__menu--right">
                {user ? (
                  <>
                    <div className="nav-dropdown__user-info">
                      <span className="nav-dropdown__greeting">Signed in as</span>
                      <strong className="nav-dropdown__username">{user.name}</strong>
                    </div>
                    <Link to="/track-order" className="nav-dropdown__item" onClick={() => setUserDropdown(false)}>
                      Track Order
                    </Link>
                    <Link to="/wishlist" className="nav-dropdown__item" onClick={() => setUserDropdown(false)}>
                      Wishlist ({wl.length})
                    </Link>
                    <div className="nav-dropdown__divider" />
                    <button className="nav-dropdown__item nav-dropdown__item--btn" onClick={() => { logout(); setUserDropdown(false); }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="nav-dropdown__user-info">
                      <strong className="nav-dropdown__username">Miraaya Account</strong>
                      <span className="nav-dropdown__subnote">Member orders & tracking</span>
                    </div>
                    <Link to="/login" className="nav-dropdown__item nav-dropdown__item--highlight" onClick={() => setUserDropdown(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="nav-dropdown__item" onClick={() => setUserDropdown(false)}>
                      Create Account
                    </Link>
                    <div className="nav-dropdown__divider" />
                    <Link to="/track-order" className="nav-dropdown__item" onClick={() => setUserDropdown(false)}>
                      Track Order
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="navbar__search">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <FiSearch size={18} className="navbar__search-icon" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search necklaces, bangles, rings, earrings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="navbar__search-input"
              />
              <button type="button" className="navbar__search-close" onClick={() => setSearchOpen(false)}>
                <FiX size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__header">
          <div className="navbar__logo">
            <span className="navbar__logo-text">Miraaya</span>
            <span className="navbar__logo-sub">JEWELS</span>
          </div>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="mobile-drawer__close">
            <FiX size={20} />
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          <Link to="/" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Home</Link>
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Shop All</Link>

          <div className="mobile-nav-category-label">Categories</div>
          {categories.map(c => (
            <Link
              key={c.slug}
              to={`/shop?category=${encodeURIComponent(c.slug)}`}
              onClick={() => setMobileOpen(false)}
              className="mobile-nav-link mobile-nav-link--cat"
            >
              {c.name}
            </Link>
          ))}

          <div className="mobile-nav-divider" />
          <Link to="/about" onClick={() => setMobileOpen(false)} className="mobile-nav-link">About Us</Link>
          <Link to="/faq" onClick={() => setMobileOpen(false)} className="mobile-nav-link">FAQ & Support</Link>
          <Link to="/track-order" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Track Order</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Contact Us</Link>

          <div className="mobile-nav-footer">
            {user ? (
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { logout(); setMobileOpen(false); }}>
                Sign Out ({user.name})
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ flex: 1, padding: '10px' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-gold" style={{ flex: 1, padding: '10px' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
