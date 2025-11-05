import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('cl_user')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  const value = useMemo(() => ({
    user,
    login(u) {
      setUser(u)
      localStorage.setItem('cl_user', JSON.stringify(u))
    },
    logout() {
      setUser(null)
      localStorage.removeItem('cl_user')
    }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


