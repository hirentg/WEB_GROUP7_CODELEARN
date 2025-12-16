/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded payload or null if invalid
 */
export function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error('Failed to decode JWT:', e)
        return null
    }
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
    const decoded = decodeJwt(token)
    if (!decoded || !decoded.exp) return true
    return decoded.exp * 1000 < Date.now()
}

/**
 * Get role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} Role from token
 */
export function getRoleFromToken(token) {
    const decoded = decodeJwt(token)
    return decoded?.role || null
}
