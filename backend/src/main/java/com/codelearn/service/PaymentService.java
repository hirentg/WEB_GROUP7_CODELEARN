package com.codelearn.service;

import com.codelearn.dto.PaymentRequestDTO;
import com.codelearn.dto.PaymentResponseDTO;
import com.codelearn.exception.BadRequestException;
import com.codelearn.exception.ResourceNotFoundException;
import com.codelearn.model.*;
import com.codelearn.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PurchasedCourseRepository purchasedCourseRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public PaymentService(PaymentRepository paymentRepository,
            PurchasedCourseRepository purchasedCourseRepository,
            UserRepository userRepository,
            CourseRepository courseRepository) {
        this.paymentRepository = paymentRepository;
        this.purchasedCourseRepository = purchasedCourseRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Process payment - ATOMIC transaction
     * 
     * SECURITY:
     * 1. userId passed from controller (extracted from SecurityContext)
     * 2. Duplicate purchase check before processing
     * 3. @Transactional for atomic Payment + PurchasedCourse creation
     */
    @Transactional
    public PaymentResponseDTO processPayment(Long userId, PaymentRequestDTO request) {

        // SECURITY: Prevent duplicate purchases
        if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, request.getCourseId())) {
            throw new BadRequestException("Course already purchased");
        }

        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        // Get course for price
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));

        // Validate payment based on method
        if (request.getPaymentMethod() == PaymentMethod.CREDIT_CARD) {
            validateCreditCard(request.getCardDetails());
        }

        // Create Payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setCourseId(request.getCourseId());
        payment.setAmount(course.getPriceAsDecimal());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.COMPLETED); // Fake: always succeeds
        payment.setTransactionId(generateTransactionId());
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Create PurchasedCourse record (ATOMIC with Payment)
        PurchasedCourse purchased = new PurchasedCourse(user, request.getCourseId());
        purchased.setPayment(payment);
        purchasedCourseRepository.save(purchased);

        // Log the successful payment
        System.out.println("Payment successful: User " + userId + " purchased course " +
                request.getCourseId() + " via " + request.getPaymentMethod());

        return PaymentResponseDTO.success(
                "Payment successful! You now have access to the course.",
                payment.getTransactionId());
    }

    /**
     * Process PayPal payment (simulated)
     * In real implementation, this would handle PayPal callback
     */
    @Transactional
    public PaymentResponseDTO processPayPalPayment(Long userId, String courseId) {
        PaymentRequestDTO request = new PaymentRequestDTO();
        request.setCourseId(courseId);
        request.setPaymentMethod(PaymentMethod.PAYPAL);

        return processPayment(userId, request);
    }

    /**
     * Fake credit card validation
     * Accepts: 16 digits, any future expiry, 3-4 digit CVV
     */
    private void validateCreditCard(PaymentRequestDTO.CreditCardDetails card) {
        if (card == null) {
            throw new BadRequestException("Credit card details are required");
        }

        String cardNumber = card.getCardNumber();
        if (cardNumber == null || !cardNumber.replaceAll("\\s", "").matches("\\d{16}")) {
            throw new BadRequestException("Invalid card number. Must be 16 digits.");
        }

        String cvv = card.getCvv();
        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            throw new BadRequestException("Invalid CVV. Must be 3-4 digits.");
        }

        String expiryMonth = card.getExpiryMonth();
        String expiryYear = card.getExpiryYear();
        if (expiryMonth == null || expiryYear == null) {
            throw new BadRequestException("Expiry date is required");
        }

        try {
            int month = Integer.parseInt(expiryMonth);
            int year = Integer.parseInt(expiryYear);
            if (month < 1 || month > 12) {
                throw new BadRequestException("Invalid expiry month");
            }
            // Simple check: year should be >= current year
            int currentYear = LocalDateTime.now().getYear() % 100;
            if (year < currentYear) {
                throw new BadRequestException("Card has expired");
            }
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid expiry date format");
        }
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
