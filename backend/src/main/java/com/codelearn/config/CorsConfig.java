package com.codelearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Chỉ định rõ các origin cho phép, tránh dùng "*"
        config.setAllowedOrigins(List.of(
            "https://web-group7-codelearn.onrender.com",  // frontend Render
            "http://localhost:5173",  // Nếu bạn đang phát triển ở localhost
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        ));

        // Các phương thức HTTP cho phép
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Chỉ định rõ các header cần thiết thay vì dùng "*"
        config.setAllowedHeaders(List.of("Content-Type", "Authorization"));

        // Expose các header để frontend có thể đọc được
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // Cho phép credentials (cookie, header authorization, v.v.)
        config.setAllowCredentials(true);

        // Cấu hình CORS cho tất cả các yêu cầu
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}