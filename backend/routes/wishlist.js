const express = require('express')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const router = express.Router()

/* GET /api/wishlist */
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM wishlist w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    )
    res.json(rows)
  } catch { res.status(500).json({ message: 'Failed to fetch wishlist' }) }
})

/* POST /api/wishlist/:productId — toggle */
router.post('/:productId', auth, async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId])
    if (exists.length) {
      await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId])
      res.json({ wishlisted: false })
    } else {
      await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, req.params.productId])
      res.json({ wishlisted: true })
    }
  } catch { res.status(500).json({ message: 'Wishlist toggle failed' }) }
})

module.exports = router
