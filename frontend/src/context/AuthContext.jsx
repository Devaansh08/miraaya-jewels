import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('mj_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
      } catch (_) {
        localStorage.removeItem('mj_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    setUser(data)
    localStorage.setItem('mj_user', JSON.stringify(data))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    setUser(data)
    localStorage.setItem('mj_user', JSON.stringify(data))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mj_user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
