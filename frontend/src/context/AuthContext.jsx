import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { decodeJwt, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('cl_user')
    const storedToken = localStorage.getItem('cl_token')
    
    // Verify token is valid and not expired
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken)
      
      // If user data exists, use it; otherwise decode from token
      if (raw) {
        try { 
          const userData = JSON.parse(raw)
          // Ensure role is in user data
          if (!userData.role && storedToken) {
            const tokenData = decodeJwt(storedToken)
            userData.role = tokenData?.role
          }
          setUser(userData)
        } catch { /* ignore */ }
      } else {
        // Try to extract user info from token
        const tokenData = decodeJwt(storedToken)
        if (tokenData) {
          setUser({
            email: tokenData.sub,
            name: tokenData.name,
            role: tokenData.role,
            userId: tokenData.userId
          })
        }
      }
    } else {
      // Clear invalid/expired token
      localStorage.removeItem('cl_user')
      localStorage.removeItem('cl_token')
    }
    
    setLoading(false)
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login(u, t) {
      setUser(u)
      setToken(t)
      localStorage.setItem('cl_user', JSON.stringify(u))
      if (t) localStorage.setItem('cl_token', t)
    },
    logout() {
      setUser(null)
      setToken(null)
      localStorage.removeItem('cl_user')
      localStorage.removeItem('cl_token')
    }
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


