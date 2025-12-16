package com.codelearn.controller;

import com.codelearn.dto.PaymentRequestDTO;
import com.codelearn.dto.PaymentResponseDTO;
import com.codelearn.service.PaymentService;
import com.codelearn.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/api/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentController {

    private final PaymentService paymentService;
    private final SecurityUtils securityUtils;

    public PaymentController(PaymentService paymentService, SecurityUtils securityUtils) {
        this.paymentService = paymentService;
        this.securityUtils = securityUtils;
    }

    /**
     * POST /api/payments/checkout
     * Process payment for a course
     * 
     * SECURITY: User ID extracted from Authorization header (JWT token)
     */
    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponseDTO> checkout(
            @Valid @RequestBody PaymentRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = securityUtils.extractUserId(authHeader);
        PaymentResponseDTO response = paymentService.processPayment(userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/payments/paypal/complete
     * Complete PayPal payment (simulated)
     */
    @PostMapping("/paypal/complete")
    public ResponseEntity<PaymentResponseDTO> completePayPal(
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = securityUtils.extractUserId(authHeader);
        String courseId = body.get("courseId");

        PaymentResponseDTO response = paymentService.processPayPalPayment(userId, courseId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/payments/history
     * Get current user's payment history
     */
    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(@RequestHeader("Authorization") String authHeader) {
        Long userId = securityUtils.extractUserId(authHeader);
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }
}
