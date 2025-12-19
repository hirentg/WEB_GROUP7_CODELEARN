import { api } from './api'

export const ratingApi = {
    // Get all ratings for a course
    getCourseRatings: (courseId) => api.get(`/ratings/course/${courseId}`),

    // Submit or update a rating
    submitRating: (courseId, rating, review) =>
        api.post('/ratings', { courseId, rating, review }),

    // Get current user's rating for a course
    getUserRating: (courseId) => api.get(`/ratings/user/${courseId}`),

    // Delete a rating
    deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`)
}
