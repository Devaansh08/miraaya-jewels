const mysql2 = require('mysql2/promise')
require('dotenv').config()

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'miraaya_jewels',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

async function testConnection() {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connected — database:', process.env.DB_NAME)
    conn.release()
  } catch (err) {
    console.warn('⚠️  MySQL Notice:', err.message)
    console.warn('   To enable persistent DB data, ensure MySQL is running and DB_PASSWORD is set in backend/.env')
  }
}

testConnection()

module.exports = pool

