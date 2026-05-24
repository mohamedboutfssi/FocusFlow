import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ff_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('ff_user')
    }
    setLoading(false)
  }, [])

  const register = ({ name, email, password }) => {
    try {
      const users = JSON.parse(localStorage.getItem('ff_users') || '[]')
      if (users.find(u => u.email === email)) {
        throw new Error('Email already in use')
      }
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        avatar: name.charAt(0).toUpperCase(),
        joinedAt: new Date().toISOString(),
        theme: 'dark',
        focusGoal: 120,
      }
      users.push(newUser)
      localStorage.setItem('ff_users', JSON.stringify(users))
      const { password: _p, ...safeUser } = newUser
      setUser(safeUser)
      localStorage.setItem('ff_user', JSON.stringify(safeUser))
      toast.success(`Welcome to FocusFlow, ${name}! 🚀`)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const login = ({ email, password }) => {
    try {
      const users = JSON.parse(localStorage.getItem('ff_users') || '[]')
      const found = users.find(u => u.email === email && u.password === password)
      if (!found) throw new Error('Invalid email or password')
      const { password: _p, ...safeUser } = found
      setUser(safeUser)
      localStorage.setItem('ff_user', JSON.stringify(safeUser))
      toast.success(`Welcome back, ${found.name}! 👋`)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ff_user')
    toast('Logged out. See you soon! 👋', { icon: '🌙' })
  }

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('ff_user', JSON.stringify(updated))
    // also update in users array
    const users = JSON.parse(localStorage.getItem('ff_users') || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates }
      localStorage.setItem('ff_users', JSON.stringify(users))
    }
    toast.success('Profile updated!')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
