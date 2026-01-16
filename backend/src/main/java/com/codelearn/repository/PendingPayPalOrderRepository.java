package com.codelearn.repository;

import com.codelearn.model.PendingPayPalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PendingPayPalOrderRepository extends JpaRepository<PendingPayPalOrder, Long> {

    Optional<PendingPayPalOrder> findByPaypalOrderId(String paypalOrderId);

    Optional<PendingPayPalOrder> findByUserIdAndPaypalOrderId(Long userId, String paypalOrderId);

    void deleteByPaypalOrderId(String paypalOrderId);

    // Clean up expired orders
    @Modifying
    @Query("DELETE FROM PendingPayPalOrder p WHERE p.expiresAt < :now")
    int deleteExpiredOrders(@Param("now") LocalDateTime now);
}
