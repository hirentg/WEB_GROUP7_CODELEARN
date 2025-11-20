package com.codelearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
        http.csrf(csrf -> csrf.disable())
            // Allow unauthenticated access to the REST auth endpoints used by the frontend
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            // Do NOT use the default form login page (frontend provides UI). For API clients return 401 instead of redirecting.
            .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) ->
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
            ));
        return http.build();
    }

    // Cấu hình PasswordEncoder để mã hóa mật khẩu
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Sử dụng BCryptPasswordEncoder để mã hóa mật khẩu
    }

    // Cấu hình AuthenticationManager để xử lý xác thực người dùng
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
