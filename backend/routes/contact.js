const express = require('express')
const pool = require('../config/db')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required' })

    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || 'General Enquiry', message]
    )
    res.json({ message: 'Message received! We will respond within 24 hours.' })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ message: 'Failed to submit message' })
  }
})

module.exports = router

