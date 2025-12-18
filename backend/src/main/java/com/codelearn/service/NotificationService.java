package com.codelearn.service;

import com.codelearn.model.Notification;
import com.codelearn.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Get all notifications for a user
     */
    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread count
     */
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Mark a single notification as read
     */
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null && notification.getUserId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    /**
     * Create a new notification
     */
    public Notification createNotification(Long userId, String type, String title, String message) {
        Notification notification = new Notification(userId, type, title, message);
        return notificationRepository.save(notification);
    }

    /**
     * Create a notification with related entity
     */
    public Notification createNotification(Long userId, String type, String title, String message,
            String relatedId, String relatedType) {
        Notification notification = new Notification(userId, type, title, message, relatedId, relatedType);
        return notificationRepository.save(notification);
    }

    /**
     * Notify student when instructor answers their question
     */
    public void notifyQuestionAnswered(Long studentId, String questionTitle, Long questionId) {
        createNotification(
                studentId,
                "QUESTION_ANSWERED",
                "Your question was answered!",
                "An instructor replied to: \"" + questionTitle + "\"",
                String.valueOf(questionId),
                "QUESTION");
    }
}
