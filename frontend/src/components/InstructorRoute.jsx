import { Navigate } from 'react-router-dom'
import { getRoleFromToken } from '../utils/jwt'

const InstructorRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  const role = getRoleFromToken(token)
  
  if (role !== 'INSTRUCTOR') {
    // Not an instructor, redirect to home
    return <Navigate to="/" replace />
  }

  // User is instructor, allow access
  return children
}

export default InstructorRoute
