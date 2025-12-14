import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('cl_user')
    const storedToken = localStorage.getItem('cl_token')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch { /* ignore */ }
    }
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const value = useMemo(() => ({
    user,
    token,
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
  }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


