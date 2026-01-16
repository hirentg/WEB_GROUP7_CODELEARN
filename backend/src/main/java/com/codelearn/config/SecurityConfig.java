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
                .requestMatchers("/error").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                
                // Upload endpoints - authenticated users only
                .requestMatchers("/api/upload/**").authenticated()
                
                // Instructor-only endpoints
                .requestMatchers("/api/courses/instructor/**").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.POST, "/api/courses").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.POST, "/api/courses/upload-thumbnail").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.PUT, "/api/courses/*").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/*").hasAuthority("INSTRUCTOR")
                .requestMatchers("/api/instructor/profile/**").hasAuthority("INSTRUCTOR")
                .requestMatchers("/api/quizzes/instructor/**").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.POST, "/api/quizzes").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.PUT, "/api/quizzes/*").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/quizzes/*").hasAuthority("INSTRUCTOR")
                .requestMatchers("/api/questions/instructor/**").hasAuthority("INSTRUCTOR")
                .requestMatchers(HttpMethod.POST, "/api/questions/answers").hasAuthority("INSTRUCTOR")
                .requestMatchers("/api/videos/upload").hasAuthority("INSTRUCTOR")
                
                // Public course browsing
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/videos/*/stream").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/ratings/course/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/*/public").permitAll()
                
                // Student/authenticated user endpoints
                .requestMatchers("/api/quizzes/course/*").authenticated()
                .requestMatchers("/api/quizzes/take/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/quizzes/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/questions/video/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/questions").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/purchases/check/**").permitAll()
                .requestMatchers("/api/purchases/**").authenticated()
                .requestMatchers("/api/ratings/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                
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
