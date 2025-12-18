const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '')

/**
 * Convert relative image URL to absolute URL
 * @param {string} url - Image URL (can be relative or absolute)
 * @returns {string} - Absolute URL
 */
export const getImageUrl = (url) => {
    if (!url) return ''

    // If already absolute URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    // If relative path, prepend server base URL
    if (url.startsWith('/')) {
        return SERVER_BASE_URL + url
    }

    // If no leading slash, add it
    return SERVER_BASE_URL + '/' + url
}
