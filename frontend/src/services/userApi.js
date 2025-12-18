import { api } from './api'

export const userApi = {
    // Get current user's profile
    getMyProfile: () => api.get('/users/me'),

    // Update current user's profile
    updateMyProfile: (data) => api.put('/users/me', data),

    // Get public profile of any user
    getPublicProfile: (userId) => api.get(`/users/${userId}/public`)
}
