const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(method, path, body) {
  const token = localStorage.getItem('cl_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  })

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
  post: (path, body) => request('POST', path, body)
}


