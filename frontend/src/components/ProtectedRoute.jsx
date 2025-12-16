import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protected Route component that checks authentication and role
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Path to redirect if not authorized (default: '/login')
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { user, token, loading } = useAuth()

  // Wait for auth check to complete
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Not logged in
  if (!user || !token) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate page based on role
      if (user.role === 'INSTRUCTOR') {
        return <Navigate to="/instructor" replace />
      } else if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
  }

  return children
}
