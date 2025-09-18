import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { auth, logOut, signInWithGoogle } from '../lib/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async () => {
    try {
      setLoading(true)
      const result = await signInWithGoogle()
      toast.success(`Welcome back, ${result.user.displayName}!`)
      return result.user
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logOut()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
