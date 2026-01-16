package com.codelearn.controller;

import com.codelearn.dto.PaymentResponseDTO;
import com.codelearn.model.*;
import com.codelearn.repository.*;
import com.codelearn.service.PayPalService;
import com.codelearn.service.PurchaseService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * PayPal Payment Controller
 * Handles PayPal payment creation and capture flow.
 * Uses database to store pending orders (production-safe, no localStorage).
 */
@RestController
@RequestMapping(path = "/api/paypal", produces = MediaType.APPLICATION_JSON_VALUE)
public class PayPalController {

        @Autowired
        private PayPalService payPalService;

        @Autowired
        private PurchaseService purchaseService;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PurchasedCourseRepository purchasedCourseRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        @Autowired
        private PendingPayPalOrderRepository pendingPayPalOrderRepository;

        @Autowired
        private JwtUtil jwtUtil;

        /**
         * POST /api/paypal/create-order
         * Creates a PayPal order and returns the order ID and approval URL.
         * Stores pending order in database for later capture.
         */
        @PostMapping("/create-order")
        @Transactional
        public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request,
                        HttpServletRequest httpRequest) {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("success", false, "message", "Unauthorized"));
                }

                Long userId = jwtUtil.getUserIdFromToken(authHeader);
                if (userId == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("success", false, "message", "Invalid token"));
                }

                String courseId = request.get("courseId");
                if (courseId == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("success", false, "message", "Course ID is required"));
                }

                // Check if already purchased
                if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("success", false, "message", "Course already purchased"));
                }

                try {
                        Course course = courseRepository.findById(courseId)
                                        .orElseThrow(() -> new RuntimeException("Course not found"));

                        var amount = purchaseService.parsePriceToDecimal(course.getPrice());

                        // Build return URLs - PayPal will redirect here with token param
                        String baseUrl = request.getOrDefault("baseUrl", "http://localhost:5173");
                        String returnUrl = baseUrl + "/checkout/" + courseId + "/paypal-success";
                        String cancelUrl = baseUrl + "/checkout/" + courseId + "/paypal-cancel";

                        String orderId = payPalService.createOrder(courseId, course.getTitle(), amount, returnUrl,
                                        cancelUrl);
                        String approvalUrl = payPalService.getApprovalUrl(orderId);

                        // Store pending order in database (replaces localStorage approach)
                        PendingPayPalOrder pendingOrder = new PendingPayPalOrder(userId, courseId, orderId);
                        pendingPayPalOrderRepository.save(pendingOrder);

                        // Clean up expired pending orders (housekeeping)
                        pendingPayPalOrderRepository.deleteExpiredOrders(LocalDateTime.now());

                        return ResponseEntity.ok(Map.of(
                                        "success", true,
                                        "orderId", orderId,
                                        "approvalUrl", approvalUrl));

                } catch (Exception e) {
                        System.err.println("PayPal create order error: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("success", false, "message",
                                                        "Failed to create PayPal order: " + e.getMessage()));
                }
        }

        /**
         * POST /api/paypal/capture-order
         * Captures the PayPal order after user approval and completes the purchase.
         * Retrieves pending order from database (not localStorage).
         */
        @PostMapping("/capture-order")
        @Transactional
        public ResponseEntity<?> captureOrder(@RequestBody Map<String, String> request,
                        HttpServletRequest httpRequest) {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(PaymentResponseDTO.failure("Unauthorized"));
                }

                Long userId = jwtUtil.getUserIdFromToken(authHeader);
                if (userId == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(PaymentResponseDTO.failure("Invalid token"));
                }

                String orderId = request.get("orderId");
                if (orderId == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(PaymentResponseDTO.failure("Order ID is required"));
                }

                // Find pending order in database (validates user owns this order)
                PendingPayPalOrder pendingOrder = pendingPayPalOrderRepository
                                .findByUserIdAndPaypalOrderId(userId, orderId)
                                .orElse(null);

                if (pendingOrder == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(PaymentResponseDTO
                                                        .failure("PayPal order not found or does not belong to you"));
                }

                if (pendingOrder.isExpired()) {
                        pendingPayPalOrderRepository.delete(pendingOrder);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(PaymentResponseDTO
                                                        .failure("PayPal order has expired. Please try again."));
                }

                String courseId = pendingOrder.getCourseId();

                // Check if already purchased (in case of double-click)
                if (purchasedCourseRepository.existsByUserIdAndCourseId(userId, courseId)) {
                        pendingPayPalOrderRepository.delete(pendingOrder);
                        return ResponseEntity.ok(PaymentResponseDTO.success(
                                        "Course already purchased!", null));
                }

                try {
                        // Capture the PayPal order
                        String transactionId = payPalService.captureOrder(orderId);

                        if (transactionId == null) {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(PaymentResponseDTO.failure("PayPal payment was not completed"));
                        }

                        // Get user and course
                        User user = userRepository.findById(userId)
                                        .orElseThrow(() -> new RuntimeException("User not found"));
                        Course course = courseRepository.findById(courseId)
                                        .orElseThrow(() -> new RuntimeException("Course not found"));

                        // Create Payment record
                        Payment payment = new Payment();
                        payment.setUserId(userId);
                        payment.setCourseId(courseId);
                        payment.setAmount(purchaseService.parsePriceToDecimal(course.getPrice()));
                        payment.setPaymentMethod(PaymentMethod.PAYPAL);
                        payment.setStatus(PaymentStatus.COMPLETED);
                        payment.setTransactionId("PP-" + transactionId);
                        payment.setCreatedAt(LocalDateTime.now());
                        paymentRepository.save(payment);

                        // Create PurchasedCourse record
                        PurchasedCourse purchasedCourse = new PurchasedCourse(user, course);
                        purchasedCourse.setPayment(payment);
                        purchasedCourseRepository.save(purchasedCourse);

                        // Increment student count
                        course.setStudents(course.getStudents() + 1);
                        courseRepository.save(course);

                        // Delete pending order (cleanup)
                        pendingPayPalOrderRepository.delete(pendingOrder);

                        System.out.println(
                                        "PayPal Payment successful: User " + userId + " purchased course " + courseId);

                        return ResponseEntity.ok(PaymentResponseDTO.success(
                                        "Payment successful! You now have access to the course.",
                                        payment.getTransactionId()));

                } catch (Exception e) {
                        System.err.println("PayPal capture order error: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(PaymentResponseDTO.failure(
                                                        "Failed to complete PayPal payment: " + e.getMessage()));
                }
        }

        /**
         * GET /api/paypal/pending-order/{orderId}
         * Check if a pending order exists and return its course ID.
         * Used by frontend after PayPal redirect to get order details.
         */
        @GetMapping("/pending-order/{orderId}")
        public ResponseEntity<?> getPendingOrder(@PathVariable String orderId,
                        HttpServletRequest httpRequest) {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("success", false, "message", "Unauthorized"));
                }

                Long userId = jwtUtil.getUserIdFromToken(authHeader);
                if (userId == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("success", false, "message", "Invalid token"));
                }

                PendingPayPalOrder pendingOrder = pendingPayPalOrderRepository
                                .findByUserIdAndPaypalOrderId(userId, orderId)
                                .orElse(null);

                if (pendingOrder == null || pendingOrder.isExpired()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("success", false, "message",
                                                        "Pending order not found or expired"));
                }

                return ResponseEntity.ok(Map.of(
                                "success", true,
                                "courseId", pendingOrder.getCourseId(),
                                "orderId", orderId));
        }
}
