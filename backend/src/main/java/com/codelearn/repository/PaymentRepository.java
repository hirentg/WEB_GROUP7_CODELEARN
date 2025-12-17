package com.codelearn.repository;

import com.codelearn.model.Payment;
import com.codelearn.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Payment> findByTransactionId(String transactionId);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, String courseId, PaymentStatus status);
}
