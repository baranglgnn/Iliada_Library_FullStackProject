package org.glgnn.kutuphane_yonetim_sistemi.Configuration;

import org.glgnn.kutuphane_yonetim_sistemi.JwtFilter.JwtAuthFilter;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.UserRepository;
import org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl.CustomUserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new CustomUserDetailsServiceImpl(userRepository);
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
                                                       PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth
                        // 1) Auth işlemleri (login, register) herkese açık:
                        .requestMatchers("/auth/**").permitAll()

                        // 2) Public GET endpoint’ler (örneğin kitap listeleme vb.):
                        .requestMatchers(HttpMethod.GET, "/books/searchBooks").permitAll()
                        .requestMatchers(HttpMethod.GET, "/books/getAllBooks").permitAll()
                        .requestMatchers(HttpMethod.GET, "/libraries/getAllLibraries").permitAll()
                        .requestMatchers(HttpMethod.GET, "/authors/getAllAuthor").permitAll()

                        // 3) Aşağıdaki işlemleri yalnızca ADMIN gerçekleştirebilsin:
                        .requestMatchers(HttpMethod.POST,   "/libraries/addLibrary").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/libraries/updateLibrary/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/libraries/deleteLibrary/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST,   "/books/addBook").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/books/updateBook/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/books/deleteBook/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST,   "/authors/addAuthor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/authors/updateAuthor/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/authors/deleteAuthor/**").hasRole("ADMIN")

                        // 4) Diğer tüm istekler (örneğin GET /getIdByTc/**) authenticated olmalı:
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
