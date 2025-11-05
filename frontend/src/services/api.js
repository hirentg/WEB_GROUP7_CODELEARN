const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  })
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return null
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body)
}


