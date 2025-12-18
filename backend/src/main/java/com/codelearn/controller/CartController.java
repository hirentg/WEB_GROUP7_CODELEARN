package com.codelearn.controller;

import com.codelearn.service.CartService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/cart", produces = MediaType.APPLICATION_JSON_VALUE)
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get user's cart with course details
     * GET /api/cart
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Map<String, Object> cart = cartService.getCartWithDetails(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get cart item count (for navbar badge)
     * GET /api/cart/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartCount(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            int count = cartService.getCartItemCount(userId);
            Map<String, Integer> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Add course to cart
     * POST /api/cart/items
     */
    @PostMapping("/items")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String courseId = body.get("courseId");
            if (courseId == null || courseId.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Course ID is required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> result = cartService.addToCart(userId, courseId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Remove course from cart
     * DELETE /api/cart/items/{courseId}
     */
    @DeleteMapping("/items/{courseId}")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @PathVariable String courseId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Map<String, Object> result = cartService.removeFromCart(userId, courseId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Clear cart
     * DELETE /api/cart
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            cartService.clearCart(userId);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Cart cleared");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
