import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { toast } from 'react-toastify'
import {
  FiChevronDown, FiChevronUp, FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiAward,
  FiClock, FiStar, FiHeart, FiGift, FiCheckCircle, FiPlay, FiPause
} from 'react-icons/fi'
import './Home.css'

const FEATURED = [
  { id: 1, name: 'Rani Kundan Floral Bangle Pair', slug: 'rani-kundan-floral-bangle-pair', price: 2650, mrp: 3050, category: 'Bangles', image_url: '/images/products/bangle-pair.jpg' },
  { id: 2, name: 'Green Stone Kundan Jhumka Earrings', slug: 'green-stone-kundan-jhumka-earrings', price: 1800, mrp: 2200, category: 'Earrings', image_url: '/images/products/jhumka-earrings.jpg' },
  { id: 3, name: 'Triple Layer Kundan Necklace Set', slug: 'triple-layer-kundan-necklace-set', price: 3200, mrp: 3800, category: 'Necklaces', image_url: '/images/products/necklace-set.jpg' },
  { id: 4, name: 'Green Stone Cocktail Ring', slug: 'green-stone-cocktail-ring', price: 1250, mrp: 1600, category: 'Rings', image_url: '/images/products/cocktail-ring.jpg' },
]

const NEW_ARRIVALS = [
  { id: 5, name: 'Kundan Pearl Passa Hair Ornament', slug: 'kundan-pearl-passa-hair-ornament', price: 2400, mrp: 2800, category: 'Hair Accessories', image_url: '/images/products/passa-ornament.jpg' },
  { id: 6, name: 'Ruby Heart Dial Cuff Watch', slug: 'ruby-heart-dial-cuff-watch', price: 2900, mrp: 3400, category: 'Watches', image_url: '/images/products/cuff-watch.jpg' },
  { id: 7, name: 'Pearl Layer Peacock Necklace Set', slug: 'pearl-layer-peacock-necklace-set', price: 3500, mrp: 4100, category: 'Necklaces', image_url: '/images/products/peacock-necklace.jpg' },
  { id: 8, name: 'Peacock Arch Pearl Jhumka Earrings', slug: 'peacock-arch-pearl-jhumka-earrings', price: 1950, mrp: 2400, category: 'Earrings', image_url: '/images/products/peacock-earrings.jpg' },
]

const CATEGORIES = [
  { name: 'Necklaces', slug: 'Necklaces', tag: 'Royal Sets', img: '/images/categories/cat-necklaces.jpg' },
  { name: 'Rings', slug: 'Rings', tag: 'Statement', img: '/images/categories/cat-rings.jpg' },
  { name: 'Bangles', slug: 'Bangles', tag: 'Kundan Pairs', img: '/images/categories/cat-bangles.jpg' },
  { name: 'Earrings', slug: 'Earrings', tag: 'Jhumkas', img: '/images/categories/cat-earrings.jpg' },
  { name: 'Hair Ornaments', slug: 'Hair Accessories', tag: 'Bridal Passa', img: '/images/categories/cat-hair.jpg' },
  { name: 'Cuff Watches', slug: 'Watches', tag: 'Jewelled', img: '/images/categories/cat-watches.jpg' },
]

const OCCASIONS = [
  { label: 'Royal Bridal Edit', desc: 'Regal Polki & Kundan sets handcrafted for life\'s grandest chapter', img: '/images/products/necklace-set.jpg' },
  { label: 'Everyday Glow', desc: 'Feather-light, anti-tarnish elegance for work and effortless evenings', img: '/images/products/jhumka-earrings.jpg' },
  { label: 'Festive & Sangeet', desc: 'Dazzling statement pieces designed to captivate under chandeliers', img: '/images/products/peacock-necklace.jpg' },
  { label: 'Luxury Gifting', desc: 'Signature velvet gift packaging with handwritten wax-seal cards', img: '/images/products/cocktail-ring.jpg' },
]

const REVIEWS = [
  { name: 'Priya Sharma (Delhi)', rating: 5, badge: 'Verified Buyer', text: 'Ordered the Rani Kundan Bangle Pair through local same-day delivery in Delhi NCR. Received within 4 hours in pristine luxury packaging! The stones sparkle like real diamonds.' },
  { name: 'Ananya Roy (Mumbai)', rating: 5, badge: 'Verified Buyer', text: 'The Triple Layer Kundan set stole the entire spotlight at my reception! Sturdy weight, authentic 22K gold look without irritating sensitive skin. Absolutely in love.' },
  { name: 'Meenakshi Iyer (Bengaluru)', rating: 5, badge: 'Verified Buyer', text: 'The peacock arch jhumkas are pure poetry! Delivered via Blue Dart Air in 2 days. The craftsmanship surpasses designer labels that cost 10x more.' },
  { name: 'Dr. Radhika K. (Chandigarh)', rating: 5, badge: 'Verified Buyer', text: 'From transparent billing to instant WhatsApp delivery updates, Miraaya Jewels sets the gold standard in online luxury jewellery shopping. 10/10!' },
]

const PARTNERS = [
  { name: 'Blue Dart Air', role: 'Air Express Partner', desc: '1-2 Days Metro Delivery' },
  { name: 'Delhivery', role: 'Pan-India Surface', desc: '19,000+ Pin Codes Covered' },
  { name: 'Shiprocket Express', role: 'Local NCR Courier', desc: 'Same-Day 4-Hour Delivery' },
  { name: 'Razorpay Secure', role: 'PCI-DSS Level 1', desc: '256-Bit SSL Encrypted' },
]

const FAQS_PREVIEW = [
  { q: 'How does Local Same-Day Delivery work?', a: 'For Delhi NCR pincodes, orders placed before 1:00 PM are delivered the same evening via our dedicated local express couriers (Shiprocket/Dunzo). A live GPS tracking link is sent via WhatsApp & SMS.' },
  { q: 'Are all Miraaya pieces hallmarked & hypoallergenic?', a: 'Yes! Every design features premium gold-alloy plating certified under stringent quality benchmarks. All pieces are 100% lead-free, nickel-free, and safe for sensitive skin.' },
  { q: 'What is included in the transparent billing summary?', a: 'Unlike other retailers, your bill includes a clean breakdown: Base Price, Applicable 3% Jewellery GST, Coupon Deductions, and optional Luxury Gift Box. No hidden surcharges ever.' },
  { q: 'What is your returns and replacement guarantee?', a: 'Enjoy a 7-day unconditional replacement or return window. If anything doesn\'t fit or meet your expectations, our courier partner will pick it up from your doorstep at zero cost.' },
]

export default function Home() {
  const [featured, setFeatured] = useState(FEATURED)
  const [newArrivals, setNewArrivals] = useState(NEW_ARRIVALS)
  const [email, setEmail] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const heroVideoRef = useRef(null)
  const showcaseVideoRef = useRef(null)

  const toggleVideoPlay = () => {
    const nextState = !isPlaying
    setIsPlaying(nextState)
    if (heroVideoRef.current) {
      if (nextState) heroVideoRef.current.play()
      else heroVideoRef.current.pause()
    }
    if (showcaseVideoRef.current) {
      if (nextState) showcaseVideoRef.current.play()
      else showcaseVideoRef.current.pause()
    }
  }

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=4').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setFeatured(r.data)
    }).catch(() => { })

    axios.get('/api/products?sort=newest&limit=4').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setNewArrivals(r.data)
    }).catch(() => { })
  }, [])

  const handleNewsletter = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/newsletter', { email })
      toast.success('Welcome to Miraaya VIP Club! Your 10% coupon code is MIRAAYA10')
      setEmail('')
    } catch {
      toast.success('Welcome to Miraaya VIP Club! Your 10% coupon code is MIRAAYA10')
      setEmail('')
    }
  }

  return (
    <div className="home">
      {/* ── Hero Section with Animated Model Flaunting Jewellery ── */}
      <section className="hero">
        <div className="hero__bg">
          <video
            ref={heroVideoRef}
            className="hero__bg-video"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/banner/hero-banner.jpg"
          >
            <source src="/videos/hero-model.mp4" type="video/mp4" />
            <img src="/images/banner/hero-banner.jpg" alt="Miraaya Jewels Heritage Collection" className="hero__bg-img" />
          </video>
          <div className="hero__overlay" />
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge-wrap">
              <span className="badge badge-gold">
                ROYAL HERITAGE COLLECTION · FESTIVE 2025
              </span>
            </div>
            <h1 className="hero__title">
              <span className="hero__title-serif">Timeless</span>
              <span className="hero__title-script">Elegance</span>
            </h1>
            <p className="hero__sub">
              Adorning life's golden moments. Handcrafted royal Indian necklaces,
              bridal Polki chokers, and heirlooms, thoughtfully curated for the modern queen.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn-gold">
                <span>Explore Collection</span>
                <FiArrowRight size={15} />
              </Link>
              <Link to="/shop?category=Necklaces" className="btn btn-outline hero__btn-outline">
                <span>Bridal Edit</span>
              </Link>
            </div>
            <div className="hero__features-row">
              <span>Same-Day NCR Delivery</span>
              <span>·</span>
              <span>100% Certified Quality</span>
              <span>·</span>
              <span>Free Pan-India Shipping</span>
            </div>
          </div>

          {/* Model Flaunting Saree & Necklace Reel Card */}
          <div className="hero__showcase">
            <div className="hero__showcase-card">
              <div className="hero__showcase-video-wrap">
                <video
                  ref={showcaseVideoRef}
                  className="hero__showcase-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/images/products/necklace-set.jpg"
                >
                  <source src="/videos/necklace-reel.mp4" type="video/mp4" />
                </video>
                <div className="hero__showcase-top-bar">
                  <div className="hero__showcase-badge">
                    <span className="live-dot" />
                    <span>ROYAL REEL · NECKLACE SPOTLIGHT</span>
                  </div>
                  <button
                    className="hero__video-toggle-btn"
                    onClick={toggleVideoPlay}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    title={isPlaying ? 'Pause showcase' : 'Play showcase'}
                    type="button"
                  >
                    {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
                  </button>
                </div>
                <div className="hero__showcase-footer">
                  <span className="hero__showcase-pill-tag">Crimson Silk Saree · Neckpiece Detail</span>
                  <span className="hero__showcase-title">Triple Layer Kundan Necklace Set</span>
                  <span className="hero__showcase-desc">100% Certified 22K Gold Finish · Handcrafted Heirlooms</span>
                  <Link to="/product/triple-layer-kundan-necklace-set" className="hero__showcase-shop-btn">
                    <span>Explore This Necklace</span>
                    <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll Down</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── Delivery & Trust Partners Bar ── */}
      <div className="trust-bar">
        <div className="container trust-bar__inner">
          <div className="trust-bar__item">
            <div className="trust-bar__icon-wrap">
              <FiTruck size={20} />
            </div>
            <div>
              <div className="trust-bar__title">Local Express Delivery</div>
              <div className="trust-bar__desc">Same-Day NCR &amp; Blue Dart Air nationwide</div>
            </div>
          </div>
          <div className="trust-bar__item">
            <div className="trust-bar__icon-wrap">
              <FiShield size={20} />
            </div>
            <div>
              <div className="trust-bar__title">Transparent Billing</div>
              <div className="trust-bar__desc">Exact 3% GST breakdown · No hidden costs</div>
            </div>
          </div>
          <div className="trust-bar__item">
            <div className="trust-bar__icon-wrap">
              <FiAward size={20} />
            </div>
            <div>
              <div className="trust-bar__title">Artisan Craftsmanship</div>
              <div className="trust-bar__desc">Certified 22K finish, hypoallergenic stones</div>
            </div>
          </div>
          <div className="trust-bar__item">
            <div className="trust-bar__icon-wrap">
              <FiRefreshCw size={20} />
            </div>
            <div>
              <div className="trust-bar__title">7-Day Free Pickup Returns</div>
              <div className="trust-bar__desc">Instant refund &amp; hassle-free exchange</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shop by Category ── */}
      <section className="section section--ivory" id="category">
        <div className="container">
          <p className="section-subtitle">
            Curated Categories
          </p>
          <h2 className="section-title">Shop by Category</h2>
          <div className="divider" />
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="category-card"
              >
                <div className="category-card__img-wrap">
                  <img src={cat.img} alt={cat.name} className="category-card__img" loading="lazy" />
                  <span className="category-card__tag">{cat.tag}</span>
                </div>
                <div className="category-card__label-wrap">
                  <span className="category-card__label">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Pieces ── */}
      <section className="section section--cream">
        <div className="container">
          <p className="section-subtitle">
            Handpicked Masterpieces
          </p>
          <h2 className="section-title">Featured Masterpieces</h2>
          <div className="divider" />
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="section__cta">
            <Link to="/shop" className="btn btn-gold">
              <span>View All Pieces</span>
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Occasions Showcase ── */}
      <section className="section section--ivory" id="occasion">
        <div className="container">
          <p className="section-subtitle">
            Designed for Every Chapter
          </p>
          <h2 className="section-title">Jewellery for Every Occasion</h2>
          <div className="divider" />
          <div className="occasions-grid">
            {OCCASIONS.map(occ => (
              <div className="occasion-card" key={occ.label}>
                <div className="occasion-card__img-wrap">
                  <img src={occ.img} alt={occ.label} className="occasion-card__img" loading="lazy" />
                  <div className="occasion-card__overlay" />
                </div>
                <div className="occasion-card__info">
                  <h3 className="occasion-card__label">{occ.label}</h3>
                  <p className="occasion-card__desc">{occ.desc}</p>
                  <Link to="/shop" className="occasion-card__link">
                    Explore Edit <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verified Delivery Partners Showcase ── */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-grid">
            {PARTNERS.map(partner => (
              <div className="partner-card" key={partner.name}>
                <div className="partner-card__title">{partner.name}</div>
                <div className="partner-card__role">{partner.role}</div>
                <div className="partner-card__desc">{partner.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="section section--cream">
        <div className="container">
          <p className="section-subtitle">
            Just Unveiled
          </p>
          <h2 className="section-title">New Arrivals</h2>
          <div className="divider" />
          <div className="product-grid">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="section__cta">
            <Link to="/shop?sort=newest" className="btn btn-outline">
              <span>Discover New Launches</span>
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story Section ── */}
      <section className="brand-story">
        <div className="brand-story__img-side">
          <img src="/images/banner/brand-story.jpg" alt="Miraaya Jewels — More Than Jewellery" />
        </div>
        <div className="brand-story__text-side">
          <p className="section-subtitle" style={{ justifyContent: 'flex-start' }}>
            Our Legacy
          </p>
          <h2 className="brand-story__title">More Than Jewellery</h2>
          <div className="divider" style={{ margin: '16px 0 24px' }} />
          <p className="brand-story__body">
            At Miraaya, we believe every piece of jewellery carries an emotion — the flutter of a wedding morning,
            the warmth of a festival, or the radiant confidence you carry into everyday life.
          </p>
          <p className="brand-story__body">
            We partner directly with traditional heritage karigars across Jaipur and Kolkata to bring you museum-worthy
            Kundan, Polki, and Meenakari heirlooms at honest, transparent prices.
          </p>
          <div className="brand-story__highlights">
            <div className="bsh-item">
              <span className="bsh-num">10,000+</span>
              <span className="bsh-lbl">Happy Queens</span>
            </div>
            <div className="bsh-item">
              <span className="bsh-num">100%</span>
              <span className="bsh-lbl">Certified BIS Polish</span>
            </div>
            <div className="bsh-item">
              <span className="bsh-num">4-Hour</span>
              <span className="bsh-lbl">NCR Delivery</span>
            </div>
          </div>
          <Link to="/about" className="btn btn-gold" style={{ marginTop: '28px' }}>
            <span>Read Our Heritage Story</span>
            <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Customer Love (Reviews) ── */}
      <section className="section section--ivory">
        <div className="container">
          <p className="section-subtitle">
            Customer Testimonials
          </p>
          <h2 className="section-title">Loved by Our Queens</h2>
          <div className="divider" />
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-card__header">
                  <div className="review-card__stars">
                    {[...Array(r.rating || 5)].map((_, idx) => (
                      <FiStar key={idx} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span className="review-card__badge">{r.badge}</span>
                </div>
                <p className="review-card__text">"{r.text}"</p>
                <div className="review-card__footer">
                  <span className="review-card__name">— {r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick FAQ Preview ── */}
      <section className="section section--cream">
        <div className="container container--narrow">
          <p className="section-subtitle">
            Instant Clarity
          </p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="divider" />
          <div className="faq-list">
            {FAQS_PREVIEW.map((faq, i) => (
              <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div className="faq-item__a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/faq" className="btn btn-outline">
              <span>View Complete FAQ Guide</span>
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter VIP Club ── */}
      <section className="newsletter">
        <div className="container container--narrow newsletter__inner">
          <span className="badge badge-gold" style={{ marginBottom: '16px' }}>
            MIRAAYA VIP CIRCLE
          </span>
          <h2 className="newsletter__title">Be First in Line</h2>
          <p className="newsletter__sub">
            Unlock secret festive drops, private showcase invites, and receive an instant ₹200 welcome gift code straight to your inbox.
          </p>
          <form className="newsletter__form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Enter your VIP email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="newsletter__input"
            />
            <button type="submit" className="btn btn-gold">
              <span>Join Club</span>
              <FiArrowRight size={15} />
            </button>
          </form>
          <p className="newsletter__note">Guaranteed zero spam. Unsubscribe with 1-click anytime.</p>
        </div>
      </section>
    </div>
  )
}
