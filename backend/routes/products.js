const express = require('express')
const pool    = require('../config/db')
const router  = express.Router()

// High-definition seed catalog fallback ensuring 100% uptime even if MySQL is offline
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Rani Kundan Floral Bangle Pair',
    slug: 'rani-kundan-floral-bangle-pair',
    description: 'A regal pair of Kundan bangles featuring an intricate floral pattern. Set with vivid green kundan stones and pearl accents, these bangles are a timeless choice for weddings, festivals, and special occasions.',
    price: 2650,
    mrp: 3050,
    category: 'Bangles',
    image_url: '/images/products/bangle-pair.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Weight","~95g (pair)"],["Size","2.4\" / 2.6\" / 2.8\""],["Occasion","Bridal, Wedding, Festive"]],
    is_featured: 1,
    is_active: 1
  },
  {
    id: 2,
    name: 'Green Stone Kundan Jhumka Earrings',
    slug: 'green-stone-kundan-jhumka-earrings',
    description: 'Elegantly crafted Kundan jhumka earrings with vivid green stone centres. The cascading bell design and intricate gold-tone work makes these perfect for both festive and casual wear.',
    price: 1800,
    mrp: 2200,
    category: 'Earrings',
    image_url: '/images/products/jhumka-earrings.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Kundan"],["Closure","Push back"],["Length","~5.5 cm"],["Occasion","Festive, Casual, Party"]],
    is_featured: 1,
    is_active: 1
  },
  {
    id: 3,
    name: 'Triple Layer Kundan Necklace Set',
    slug: 'triple-layer-kundan-necklace-set',
    description: 'A stunning triple-layer Kundan necklace set that exudes royalty. Features three tiers of intricate Kundan work with green stone drops and freshwater pearl beading, complete with matching earrings.',
    price: 3200,
    mrp: 3800,
    category: 'Necklaces',
    image_url: '/images/products/necklace-set.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Length","14–18 inch"],["Includes","Necklace + Earrings"],["Occasion","Bridal, Wedding"]],
    is_featured: 1,
    is_active: 1
  },
  {
    id: 4,
    name: 'Green Stone Cocktail Ring',
    slug: 'green-stone-cocktail-ring',
    description: 'A bold statement cocktail ring featuring a large emerald-green stone in a detailed gold-tone filigree setting. Adjustable band fits most sizes.',
    price: 1250,
    mrp: 1600,
    category: 'Rings',
    image_url: '/images/products/cocktail-ring.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Green semi-precious"],["Band","Adjustable"],["Weight","~15g"],["Occasion","Party, Festive"]],
    is_featured: 1,
    is_active: 1
  },
  {
    id: 5,
    name: 'Kundan Pearl Passa Hair Ornament',
    slug: 'kundan-pearl-passa-hair-ornament',
    description: 'A traditional bridal side-tikka (passa) crafted with intricate Kundan work and cascading freshwater pearls. Worn to the left side of the head, this ornament elevates any bridal look.',
    price: 2400,
    mrp: 2800,
    category: 'Hair Accessories',
    image_url: '/images/products/passa-ornament.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Chain length","~18 inch"],["Occasion","Bridal, Wedding"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 6,
    name: 'Ruby Heart Dial Cuff Watch',
    slug: 'ruby-heart-dial-cuff-watch',
    description: 'A unique fusion of fashion jewellery and timepiece — the Ruby Heart Dial Cuff Watch features a heart-shaped ruby-red dial seamlessly integrated into an engraved gold-tone cuff bracelet.',
    price: 2900,
    mrp: 3400,
    category: 'Watches',
    image_url: '/images/products/cuff-watch.jpg',
    specs: [["Movement","Quartz"],["Metal","Gold-toned alloy"],["Dial","Heart-shape, ruby red"],["Water resistance","Splash resistant"],["Battery","Included"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 7,
    name: 'Pearl Layer Peacock Necklace Set',
    slug: 'pearl-layer-peacock-necklace-set',
    description: 'Inspired by the grandeur of the Indian peacock, this multi-layer necklace set features a central peacock motif with enamel detailing and three layers of freshwater pearls.',
    price: 3500,
    mrp: 4100,
    category: 'Necklaces',
    image_url: '/images/products/peacock-necklace.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Length","12–18 inch"],["Includes","Necklace + Earrings"],["Occasion","Bridal, Festive"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 8,
    name: 'Peacock Arch Pearl Jhumka Earrings',
    slug: 'peacock-arch-pearl-jhumka-earrings',
    description: 'Beautifully crafted jhumka earrings with an arched peacock stud top and a hanging pearl jhumka bell. The peacock enamel work in blue and green makes these a unique statement piece.',
    price: 1950,
    mrp: 2400,
    category: 'Earrings',
    image_url: '/images/products/peacock-earrings.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Length","~5 cm"],["Closure","Push back"],["Occasion","Festive, Bridal"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 9,
    name: 'Sparkle Stone Bangle Pair',
    slug: 'sparkle-stone-bangle-pair',
    description: 'A pair of gold-tone bangles encrusted with sparkling white crystal stones in an intricate openwork floral pattern.',
    price: 1750,
    mrp: 2275,
    category: 'Bangles',
    image_url: '/images/products/sparkle-bangle.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","White crystal"],["Weight","~70g (pair)"],["Occasion","Festive, Party"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 10,
    name: 'Pearl Fringe Meenakari Bangles',
    slug: 'pearl-fringe-meenakari-bangles',
    description: 'Traditional Meenakari enamel bangles with vibrant floral motifs and hanging pearl fringe along the rim.',
    price: 2750,
    mrp: 3175,
    category: 'Bangles',
    image_url: '/images/products/meenakari-bangles.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Occasion","Bridal, Festive"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 11,
    name: 'Royal Enamel Kada Pair',
    slug: 'royal-enamel-kada-pair',
    description: 'Elegant kadas with royal blue enamel inlay and kundan accents. A timeless pair for weddings and ceremonies.',
    price: 2550,
    mrp: 2950,
    category: 'Bangles',
    image_url: '/images/products/bangle-pair.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Enamel & Kundan"],["Occasion","Bridal, Wedding"]],
    is_featured: 0,
    is_active: 1
  },
  {
    id: 12,
    name: 'Rajwadi Blossom Kada Pair',
    slug: 'rajwadi-blossom-kada-pair',
    description: 'Intricate kadas with blossom motifs and pearl detailing. Inspired by Rajasthani royal jewellery traditions.',
    price: 2700,
    mrp: 3050,
    category: 'Bangles',
    image_url: '/images/products/meenakari-bangles.jpg',
    specs: [["Metal","Gold-toned alloy"],["Stone","Pearl & Kundan"],["Occasion","Bridal, Festive"]],
    is_featured: 0,
    is_active: 1
  }
]

/* GET /api/products — list with optional filters */
router.get('/', async (req, res) => {
  const { category, sort, search, featured, limit } = req.query

  try {
    let sql  = 'SELECT * FROM products WHERE is_active = 1'
    const params = []

    if (category) { sql += ' AND category = ?'; params.push(category) }
    if (featured) { sql += ' AND is_featured = 1' }
    if (search)   { sql += ' AND name LIKE ?';   params.push(`%${search}%`) }

    if (sort === 'price-asc')       sql += ' ORDER BY price ASC'
    else if (sort === 'price-desc') sql += ' ORDER BY price DESC'
    else if (sort === 'newest')     sql += ' ORDER BY created_at DESC'
    else if (sort === 'discount')   sql += ' ORDER BY ((mrp - price) / mrp) DESC'
    else sql += ' ORDER BY is_featured DESC, created_at DESC'

    if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)) }

    const [rows] = await pool.query(sql, params)
    return res.json(rows)
  } catch (err) {
    // Graceful fallback to static catalog data
    let list = [...FALLBACK_PRODUCTS]
    if (category) list = list.filter(p => p.category.toLowerCase() === category.toLowerCase())
    if (featured) list = list.filter(p => p.is_featured === 1)
    if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    if (sort === 'price-asc')       list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'discount')   list.sort((a, b) => ((b.mrp - b.price)/b.mrp) - ((a.mrp - a.price)/a.mrp))
    else if (sort === 'newest')     list.sort((a, b) => b.id - a.id)

    if (limit) list = list.slice(0, parseInt(limit))
    return res.json(list)
  }
})

/* GET /api/products/:slug — single product + related */
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND is_active = 1', [req.params.slug])
    if (rows && rows.length) {
      const product = rows[0]
      if (product.specs && typeof product.specs === 'string') {
        try { product.specs = JSON.parse(product.specs) } catch { product.specs = [] }
      }
      const [related] = await pool.query(
        'SELECT * FROM products WHERE category = ? AND id != ? AND is_active = 1 LIMIT 4',
        [product.category, product.id]
      )
      return res.json({ product, related })
    }
  } catch (err) {
    // Ignore and proceed to fallback
  }

  // Fallback
  const product = FALLBACK_PRODUCTS.find(p => p.slug === req.params.slug)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  const related = FALLBACK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  return res.json({ product, related })
})

module.exports = router
