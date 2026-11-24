const express = require('express')
const pool    = require('../config/db')
const auth    = require('../middleware/auth')
const router  = express.Router()

/* POST /api/orders — place order */
router.post('/', auth, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const { items, shipping_address, payment_method } = req.body
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' })

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal >= 999 ? 0 : 99
    const total    = subtotal + shipping

    const orderNum = `MJ-${Date.now()}`
    const [result] = await conn.query(
      `INSERT INTO orders (user_id, order_number, total, shipping_charge, status, shipping_address, payment_method)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [req.user.id, orderNum, total, shipping, JSON.stringify(shipping_address), payment_method || 'cod']
    )
    const orderId = result.insertId

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.qty, item.price]
      )
    }

    await conn.commit()
    res.status(201).json({ order_id: orderId, order_number: orderNum, total, message: 'Order placed successfully' })
  } catch (err) {
    await conn.rollback()
    console.error('Order error:', err)
    res.status(500).json({ message: 'Failed to place order' })
  } finally {
    conn.release()
  }
})

/* GET /api/orders/my — user's orders */
router.get('/my', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, GROUP_CONCAT(p.name SEPARATOR ', ') AS products
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = ?
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    )
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

/* POST /api/orders/track — track by order number + email */
router.post('/track', async (req, res) => {
  try {
    const { order, email } = req.body
    const [rows] = await pool.query(
      `SELECT o.order_number, o.status, o.created_at, o.tracking_number, u.email
       FROM orders o JOIN users u ON u.id = o.user_id
       WHERE o.order_number = ? AND u.email = ?`,
      [order, email]
    )
    if (!rows.length) return res.status(404).json({ message: 'Order not found' })
    const o = rows[0]
    res.json({
      order_number: o.order_number,
      status: o.status,
      tracking_number: o.tracking_number,
      last_update: new Date(o.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })
    })
  } catch (err) {
    res.status(500).json({ message: 'Tracking failed' })
  }
})

/* POST /api/orders/cancel */
router.post('/cancel', async (req, res) => {
  try {
    const { order, email, reason } = req.body
    const [rows] = await pool.query(
      `SELECT o.id, o.status FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.order_number = ? AND u.email = ?`,
      [order, email]
    )
    if (!rows.length) return res.status(404).json({ message: 'Order not found' })
    if (rows[0].status === 'shipped' || rows[0].status === 'delivered') {
      return res.status(400).json({ message: 'Order already dispatched. Please use the Returns process.' })
    }
    await pool.query('UPDATE orders SET status = "cancelled", cancel_reason = ? WHERE id = ?', [reason, rows[0].id])
    res.json({ message: 'Order cancelled successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed' })
  }
})

module.exports = router
