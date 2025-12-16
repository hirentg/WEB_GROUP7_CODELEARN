package com.codelearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    // Cấu hình các quyền truy cập và bảo mật cho các URL
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable CORS support for the security filter chain
        http.cors(cors -> {
        });

        // Disable CSRF for API usage and use stateless session management for
        // token-based auth
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Allow unauthenticated access to the REST auth endpoints and CORS preflight
        // Note: Some endpoints handle auth internally via JWT token in Authorization
        // header
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/video-previews/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/my-learning").permitAll()
                // Payment endpoints - handle auth internally via SecurityUtils
                .requestMatchers(HttpMethod.POST, "/api/payments/**").permitAll()
                // Lesson endpoints - handle auth internally via SecurityUtils
                .requestMatchers("/api/courses/*/lessons").permitAll()
                .requestMatchers("/api/courses/*/check-access").permitAll()
                .requestMatchers("/api/courses/*/progress").permitAll()
                .anyRequest().authenticated());

        // Return 401 for unauthenticated API requests instead of redirecting to a login
        // page
        http.exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> response
                .sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")));
        return http.build();
    }

    // Cấu hình PasswordEncoder để mã hóa mật khẩu
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Sử dụng BCryptPasswordEncoder để mã hóa mật khẩu
    }

    // Cấu hình AuthenticationManager để xử lý xác thực người dùng
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
