import { api } from './api';

const cartApi = {
    // Get cart with course details
    getCart: async () => {
        return await api.get('/cart');
    },

    // Get cart item count (for navbar badge)
    getCount: async () => {
        return await api.get('/cart/count');
    },

    // Add course to cart
    addToCart: async (courseId) => {
        return await api.post('/cart/items', { courseId });
    },

    // Remove course from cart
    removeFromCart: async (courseId) => {
        return await api.delete(`/cart/items/${courseId}`);
    },

    // Clear cart
    clearCart: async () => {
        return await api.delete('/cart');
    }
};

export default cartApi;
