import { createContext, useState, useEffect } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if a token exists and fetch the current user
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      getCurrentUser()
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Log in with email and password
  const login = async (email, password) => {
    const res = await loginUser({ email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  // Sign up a new account
  const signup = async (name, email, password) => {
    const res = await registerUser({ name, email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  // Log out and clear stored data
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Refresh user data (useful after profile updates)
  const refreshUser = async () => {
    try {
      const res = await getCurrentUser()
      setUser(res.data)
    } catch {
      // If it fails, don't crash — just leave user as-is
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
