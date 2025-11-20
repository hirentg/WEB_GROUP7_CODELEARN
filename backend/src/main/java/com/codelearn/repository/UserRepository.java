package com.codelearn.repository;

// Reverted: placeholder to neutralize previously added UserRepository
import com.codelearn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Long> {
    User findByName(String name);
    User findByEmail(String email);
    
}


