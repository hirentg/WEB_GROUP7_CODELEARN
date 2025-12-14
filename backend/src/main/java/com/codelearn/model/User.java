package com.codelearn.model;
import jakarta.persistence.*;


@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;       // Khóa chính, tự động tăng
    
    private String name;   // Trường tên người dùng
    
    @Column(unique = true)
    private String email;  // Trường email, đảm bảo duy nhất
    
    private String password;  // Trường mật khẩu người dùng

    // Constructor mặc định
    public User() {}

    // Constructor có tham số để tạo User dễ dàng
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
