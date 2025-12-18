import { api } from './api';

const notificationApi = {
    // Get all notifications
    getNotifications: async () => {
        return await api.get('/notifications');
    },

    // Get unread count
    getUnreadCount: async () => {
        return await api.get('/notifications/unread-count');
    },

    // Mark single notification as read
    markAsRead: async (id) => {
        return await api.put(`/notifications/${id}/read`);
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        return await api.put('/notifications/read-all');
    }
};

export default notificationApi;
