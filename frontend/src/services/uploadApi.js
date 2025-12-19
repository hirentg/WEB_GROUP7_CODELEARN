import { api } from './api'

/**
 * Upload thumbnail image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadThumbnail = async (file) => {
    if (!file) {
        throw new Error('No file provided')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/thumbnail', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    if (response.success) {
        return response.url
    } else {
        throw new Error(response.message || 'Failed to upload thumbnail')
    }
}

/**
 * Upload avatar image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadAvatar = async (file) => {
    if (!file) {
        throw new Error('No file provided')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    if (response.success) {
        return response.url
    } else {
        throw new Error(response.message || 'Failed to upload avatar')
    }
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Full Cloudinary URL
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
    if (!imageUrl) {
        throw new Error('No image URL provided')
    }

    const response = await api.delete(`/upload?url=${encodeURIComponent(imageUrl)}`)

    if (!response.success) {
        throw new Error(response.message || 'Failed to delete image')
    }
}
