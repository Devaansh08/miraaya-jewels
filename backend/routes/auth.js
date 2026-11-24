const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const router = express.Router()

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, name: user.name, role: user.role },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: process.env.JWT_EXPIRES || '7d' }
)

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) return res.status(409).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "customer")',
      [name, email, hash]
    )

    const user = { id: result.insertId, email, name, role: 'customer' }
    res.status(201).json({ ...user, token: signToken(user) })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ message: 'Invalid email or password' })

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    const payload = { id: user.id, email: user.email, name: user.name, role: user.role }
    res.json({ ...payload, token: signToken(payload) })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id])
    if (!rows.length) return res.status(404).json({ message: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router

