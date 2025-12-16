import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import InstructorLayout from '../components/Layout/InstructorLayout'

const InstructorPage = () => {
  const location = useLocation()
  
  // Extract selected key from pathname (e.g., /instructor/courses -> courses)
  const pathParts = location.pathname.split('/')
  const selected = pathParts[2] || 'overview'

  return (
    <InstructorLayout selected={selected}>
      <Outlet />
    </InstructorLayout>
  )
}

export default InstructorPage
