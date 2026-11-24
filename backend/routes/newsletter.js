const express = require('express')
const pool = require('../config/db')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })
    await pool.query(
      'INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)',
      [email]
    )
    res.json({ message: 'Subscribed successfully' })
  } catch (err) {
    console.error('Newsletter error:', err)
    res.status(500).json({ message: 'Subscription failed' })
  }
})

module.exports = router

