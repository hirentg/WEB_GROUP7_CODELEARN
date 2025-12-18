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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

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
        // IMPORTANT: More specific rules must come BEFORE wildcard rules
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll() // Allow error page access
                .requestMatchers("/uploads/**").permitAll() // Allow access to uploaded files
                // More specific patterns FIRST (before /api/courses/**)
                .requestMatchers(HttpMethod.GET, "/api/courses/instructor/my-courses").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/courses").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/courses/upload-thumbnail").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/courses/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/courses/*").authenticated()
                // Then allow public GET access to courses
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/videos/*/stream").permitAll()
                // Quiz endpoints
                .requestMatchers(HttpMethod.GET, "/api/quizzes/instructor/my-quizzes").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/quizzes/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/quizzes").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/quizzes/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/quizzes/*").authenticated()
                // Purchase endpoints
                .requestMatchers("/api/purchases/check/**").permitAll() // Check access can be public
                .requestMatchers("/api/purchases/**").authenticated()
                // Other authenticated endpoints
                .requestMatchers("/api/videos/upload").authenticated()
                .requestMatchers("/api/instructor/profile").authenticated()
                .anyRequest().authenticated());

        // Return 401 for unauthenticated API requests instead of redirecting to a login
        // page
        http.exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> response
                .sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")));

        // Add JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

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
