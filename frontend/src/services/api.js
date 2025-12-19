const BASE_URL = import.meta.env.VITE_API_URL || 'https://codelearn-backend.onrender.com/api'

async function request(method, path, body) {
  const token = localStorage.getItem('cl_token')
  const headers = {}

  // Check if body is FormData - don't set Content-Type (browser will set it with boundary)
  const isFormData = body instanceof FormData

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = {
    method,
    headers,
  }

  // Only stringify non-FormData bodies
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body)
  }

  const res = await fetch(`${BASE_URL}${path}`, options)

  if (!res.ok) {
    if (res.status === 404) return null
    // Try to get error message from response body
    try {
      const errorData = await res.json()
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`)
    } catch (e) {
      if (e.message && !e.message.startsWith('HTTP')) throw e
      throw new Error(`HTTP ${res.status}`)
    }
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return null
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),

  // Instructor stats
  getInstructorStats: () => request('GET', '/instructor/profile/stats'),
  getInstructorEnrollmentTrend: () => request('GET', '/instructor/profile/enrollment-trend'),
  getInstructorCoursePerformance: () => request('GET', '/instructor/profile/course-performance'),
  getStudentProgressDistribution: () => request('GET', '/instructor/profile/student-progress-distribution'),
  getDetailedCourseStats: () => request('GET', '/instructor/profile/detailed-course-stats'),
}


