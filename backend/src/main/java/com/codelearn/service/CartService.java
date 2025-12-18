package com.codelearn.service;

import com.codelearn.model.Cart;
import com.codelearn.model.CartItem;
import com.codelearn.model.Course;
import com.codelearn.repository.CartItemRepository;
import com.codelearn.repository.CartRepository;
import com.codelearn.repository.CourseRepository;
import com.codelearn.repository.PurchasedCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PurchasedCourseRepository purchasedCourseRepository;

    /**
     * Get or create cart for user
     */
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(userId)));
    }

    /**
     * Get cart with populated course details
     */
    public Map<String, Object> getCartWithDetails(Long userId) {
        Cart cart = getOrCreateCart(userId);

        List<Map<String, Object>> items = cart.getItems().stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("courseId", item.getCourseId());
            itemMap.put("addedAt", item.getAddedAt());

            // Fetch course details
            Course course = courseRepository.findById(item.getCourseId()).orElse(null);
            if (course != null) {
                itemMap.put("courseTitle", course.getTitle());
                itemMap.put("courseThumbnail", course.getThumbnailUrl());
                itemMap.put("courseInstructor", course.getInstructor());
                itemMap.put("coursePrice", course.getPrice());
            }

            return itemMap;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("id", cart.getId());
        response.put("itemCount", cart.getItems().size());
        response.put("items", items);

        return response;
    }

    /**
     * Add course to cart
     */
    public Map<String, Object> addToCart(Long userId, String courseId) {
        // Check if course exists
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // Check if already purchased
        boolean alreadyPurchased = purchasedCourseRepository.findByUserIdAndCourseId(userId, courseId).isPresent();
        if (alreadyPurchased) {
            throw new RuntimeException("Course already purchased");
        }

        Cart cart = getOrCreateCart(userId);

        // Check if already in cart
        boolean alreadyInCart = cart.getItems().stream()
                .anyMatch(item -> item.getCourseId().equals(courseId));

        if (alreadyInCart) {
            throw new RuntimeException("Course already in cart");
        }

        // Add to cart
        CartItem item = new CartItem(courseId);
        cart.addItem(item);
        cartRepository.save(cart);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Course added to cart");
        response.put("itemCount", cart.getItems().size());
        return response;
    }

    /**
     * Remove course from cart
     */
    public Map<String, Object> removeFromCart(Long userId, String courseId) {
        Cart cart = getOrCreateCart(userId);

        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getCourseId().equals(courseId))
                .findFirst()
                .orElse(null);

        if (itemToRemove == null) {
            throw new RuntimeException("Course not in cart");
        }

        cart.removeItem(itemToRemove);
        cartRepository.save(cart);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Course removed from cart");
        response.put("itemCount", cart.getItems().size());
        return response;
    }

    /**
     * Clear cart
     */
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    /**
     * Get cart item count
     */
    public int getCartItemCount(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        return cart != null ? cart.getItems().size() : 0;
    }
}
