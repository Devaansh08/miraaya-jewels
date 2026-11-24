const express = require('express')
const cors = require('cors')
const path = require('path')
const compression = require('compression')
require('dotenv').config()

const app = express()

// ── 1. High-Traffic Compression & Security Headers ──
app.use(compression({
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// ── 2. CORS Configuration ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

// ── 3. High-Traffic In-Memory Rate Limiter (Prevents DDoS & Spikes) ──
const rateLimits = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120

app.use('/api', (req, res, next) => {
  // Allow health checks to run without limits
  if (req.path === '/health') return next()

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const record = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW }

  if (now > record.resetAt) {
    record.count = 1
    record.resetAt = now + RATE_LIMIT_WINDOW
  } else {
    record.count += 1
  }
  rateLimits.set(ip, record)

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW)
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count))

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'High traffic detected. Please slow down and try again shortly.',
      retryAfter: Math.ceil((record.resetAt - now) / 1000)
    })
  }
  next()
})

// Clean up stale rate-limit IP records every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimits.entries()) {
    if (now > data.resetAt) rateLimits.delete(ip)
  }
}, 5 * 60 * 1000).unref()

// ── 4. Body Parsers ──
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// ── 5. Static Assets with High-Performance Cache-Control ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '30d',
  immutable: true,
  etag: true,
}))

// ── 6. In-Memory Micro-Cache for Catalog (Zero DB Latency under Load) ──
const cacheStore = new Map()
function cacheMiddleware(durationSeconds = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next()

    const key = '__cache__' + req.originalUrl || req.url
    const cachedItem = cacheStore.get(key)
    const now = Date.now()

    if (cachedItem && now < cachedItem.expireAt) {
      res.setHeader('X-Cache', 'HIT')
      return res.json(cachedItem.data)
    }

    res.setHeader('X-Cache', 'MISS')
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, { data: body, expireAt: now + (durationSeconds * 1000) })
      }
      return originalJson(body)
    }
    next()
  }
}

// ── 7. API Routes with Micro-Caching ──
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', cacheMiddleware(30), require('./routes/products'))
app.use('/api/categories', cacheMiddleware(60), require('./routes/categories'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/newsletter', require('./routes/newsletter'))
app.use('/api/contact', require('./routes/contact'))

// ── 8. Health, SEO Robots & Sitemap Endpoints ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Miraaya Jewels API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  })
})

app.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send(`User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /wishlist\nDisallow: /api/\n\nSitemap: https://miraayajewels.com/sitemap.xml\n`)
})

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml')
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://miraayajewels.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://miraayajewels.com/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://miraayajewels.com/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://miraayajewels.com/faq</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://miraayajewels.com/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
</urlset>`)
})

// ── 9. Error & 404 Handlers ──
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

app.use((err, req, res, next) => {
  console.error('API Error:', err.message)
  res.status(500).json({ message: 'Internal server error' })
})

// Prevent unhandled promise rejections from crashing the process under burst traffic
process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection caught safely:', reason)
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Miraaya Jewels API running at http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
})

// Configure HTTP keep-alive timeouts for high concurrent traffic throughput
server.keepAliveTimeout = 65000
server.headersTimeout = 66000
