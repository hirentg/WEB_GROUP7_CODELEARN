package com.codelearn.service;

import com.codelearn.dto.PaymentRequestDTO;
import com.codelearn.dto.PaymentResponseDTO;
import com.codelearn.model.*;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.PaymentRepository;
import com.codelearn.repository.PurchasedCourseRepository;
import com.codelearn.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    @Autowired
    private PurchasedCourseRepository purchasedCourseRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Process payment and purchase course
     * CRITICAL: Parses Course.price String to BigDecimal for Payment entity
     */
    @Transactional
    public PaymentResponseDTO processPayment(Long userId, PaymentRequestDTO request) {
        // Check if already purchased
        if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, request.getCourseId())) {
            return PaymentResponseDTO.failure("Course already purchased");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Validate credit card if applicable
        if (request.getPaymentMethod() == PaymentMethod.CREDIT_CARD) {
            String validationError = validateCreditCard(request.getCardDetails());
            if (validationError != null) {
                return PaymentResponseDTO.failure(validationError);
            }
        }

        // Create Payment record with parsed BigDecimal amount
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setCourseId(request.getCourseId());
        payment.setAmount(parsePriceToDecimal(course.getPrice())); // CRITICAL: Parse String to BigDecimal
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.COMPLETED); // Fake: always succeeds
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Create PurchasedCourse record
        PurchasedCourse purchasedCourse = new PurchasedCourse(user, course);
        purchasedCourse.setPayment(payment);
        purchasedCourseRepository.save(purchasedCourse);

        System.out.println("Payment successful: User " + userId + " purchased course " +
                request.getCourseId() + " via " + request.getPaymentMethod());

        return PaymentResponseDTO.success(
                "Payment successful! You now have access to the course.",
                payment.getTransactionId());
    }

    /**
     * CRITICAL: Parse Course.price String (e.g., "$14.99") to BigDecimal
     */
    public BigDecimal parsePriceToDecimal(String price) {
        if (price == null || price.equalsIgnoreCase("Free")) {
            return BigDecimal.ZERO;
        }
        String cleaned = price.replaceAll("[^\\d.]", ""); // Remove $, commas, etc.
        try {
            return new BigDecimal(cleaned);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Fake credit card validation
     * Accepts: 16 digits, future expiry, 3-4 digit CVV
     */
    private String validateCreditCard(PaymentRequestDTO.CreditCardDetails card) {
        if (card == null) {
            return "Credit card details are required";
        }

        String cardNumber = card.getCardNumber();
        if (cardNumber == null || !cardNumber.replaceAll("\\s", "").matches("\\d{16}")) {
            return "Invalid card number. Must be 16 digits.";
        }

        String cvv = card.getCvv();
        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            return "Invalid CVV. Must be 3-4 digits.";
        }

        if (card.getExpiryMonth() == null || card.getExpiryYear() == null) {
            return "Expiry date is required";
        }

        try {
            int month = Integer.parseInt(card.getExpiryMonth());
            int year = Integer.parseInt(card.getExpiryYear());
            if (month < 1 || month > 12) {
                return "Invalid expiry month";
            }
            int currentYear = LocalDateTime.now().getYear() % 100;
            if (year < currentYear) {
                return "Card has expired";
            }
        } catch (NumberFormatException e) {
            return "Invalid expiry date format";
        }

        if (card.getCardholderName() == null || card.getCardholderName().trim().isEmpty()) {
            return "Cardholder name is required";
        }

        return null; // Valid
    }

    /**
     * Update user's course progress
     */
    @Transactional
    public void updateProgress(Long userId, String courseId, int percent) {
        int boundedPercent = Math.min(100, Math.max(0, percent));
        purchasedCourseRepository.updateProgress(userId, courseId, boundedPercent);
    }

    // Existing methods
    @Transactional
    public PurchasedCourse purchaseCourse(Long userId, String courseId) {
        if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Course already purchased");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        PurchasedCourse purchasedCourse = new PurchasedCourse(user, course);
        return purchasedCourseRepository.save(purchasedCourse);
    }

    @Transactional(readOnly = true)
    public List<Course> getPurchasedCourses(Long userId) {
        // Use JOIN FETCH query to avoid lazy loading issues
        List<PurchasedCourse> purchasedCourses = purchasedCourseRepository.findByUserIdWithCourse(userId);
        return purchasedCourses.stream()
                .map(PurchasedCourse::getCourse)
                .collect(Collectors.toList());
    }

    public boolean isCoursePurchased(Long userId, String courseId) {
        return purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}
