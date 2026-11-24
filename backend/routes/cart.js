const express = require('express')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.qty, p.id AS product_id, p.name, p.slug, p.price, p.mrp, p.image_url, p.category
       FROM cart c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    )
    res.json(rows)
  } catch {
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { product_id, qty = 1 } = req.body
    const [exists] = await pool.query('SELECT id, qty FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, product_id])
    if (exists.length) {
      await pool.query('UPDATE cart SET qty = qty + ? WHERE id = ?', [qty, exists[0].id])
    } else {
      await pool.query('INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)', [req.user.id, product_id, qty])
    }
    res.json({ message: 'Added to cart' })
  } catch {
    res.status(500).json({ message: 'Failed to update cart' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { qty } = req.body
    if (qty < 1) {
      await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    } else {
      await pool.query('UPDATE cart SET qty = ? WHERE id = ? AND user_id = ?', [qty, req.params.id, req.user.id])
    }
    res.json({ message: 'Cart updated' })
  } catch {
    res.status(500).json({ message: 'Failed to update cart' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    res.json({ message: 'Item removed' })
  } catch {
    res.status(500).json({ message: 'Failed to remove item' })
  }
})

module.exports = router

