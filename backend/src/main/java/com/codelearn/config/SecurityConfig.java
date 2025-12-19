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
import org.springframework.web.cors.CorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    // 👇 inject CorsConfigurationSource
    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // ✅ CORS: BẮT BUỘC gắn source vào Spring Security
        http.cors(withDefaults());

        // Disable CSRF for API usage and use stateless session management
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Authorization rules
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/uploads/**").permitAll()

                // Courses
                .requestMatchers(HttpMethod.GET, "/api/courses/instructor/my-courses").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/courses").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/courses/upload-thumbnail").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/courses/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/courses/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").permitAll()

                // Videos
                .requestMatchers(HttpMethod.GET, "/api/videos/*/stream").permitAll()
                .requestMatchers("/api/videos/upload").authenticated()

                // Quizzes
                .requestMatchers(HttpMethod.GET, "/api/quizzes/instructor/my-quizzes").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/quizzes/course/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/quizzes/take/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/quizzes/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/quizzes").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/quizzes/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/quizzes/*").authenticated()

                // Questions
                .requestMatchers(HttpMethod.GET, "/api/questions/video/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/questions/instructor/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/questions").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/questions/answers").authenticated()

                // Notifications / Cart / Purchases
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/purchases/check/**").permitAll()
                .requestMatchers("/api/purchases/**").authenticated()

                // Ratings
                .requestMatchers(HttpMethod.GET, "/api/ratings/course/**").permitAll()
                .requestMatchers("/api/ratings/**").authenticated()

                // Users
                .requestMatchers(HttpMethod.GET, "/api/users/*/public").permitAll()
                .requestMatchers("/api/users/**").authenticated()

                // Instructor profile
                .requestMatchers(HttpMethod.GET, "/api/instructor/profile/*/public").permitAll()
                .requestMatchers("/api/instructor/profile/**").authenticated()

                .anyRequest().authenticated()
        );

        // Return 401 instead of redirect
        http.exceptionHandling(ex -> ex.authenticationEntryPoint(
                (request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
        ));

        // JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
