const express = require('express')
const pool = require('../config/db')
const router = express.Router()

const FALLBACK_CATEGORIES = [
  { name: 'Bangles', product_count: 5 },
  { name: 'Earrings', product_count: 2 },
  { name: 'Hair Accessories', product_count: 1 },
  { name: 'Necklaces', product_count: 2 },
  { name: 'Rings', product_count: 1 },
  { name: 'Watches', product_count: 1 }
]

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category AS name, COUNT(*) AS product_count
      FROM products WHERE is_active = 1
      GROUP BY category ORDER BY category ASC
    `)
    return res.json(rows)
  } catch (err) {
    return res.json(FALLBACK_CATEGORIES)
  }
})

module.exports = router
