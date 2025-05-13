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

    // Backend projenizdeki Spring Security Config sınıfında

    // Backend projenizdeki Spring Security Config sınıfında

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF devre dışı bırakıldıysa böyle kalır
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth
                        // /auth/** endpointine herkese izin ver
                        .requestMatchers("/auth/**").permitAll()

                        // Kitap listesine GET metodu ile herkese izin ver
                        .requestMatchers(HttpMethod.GET, "/books/getAllBooks").permitAll()

                        .requestMatchers("/getIdByTc/**").authenticated()

                        // *** Kütüphane listesine GET metodu ile herkese izin ver - BU SATIR DOĞRU GÖRÜNÜYOR ***
                        .requestMatchers(HttpMethod.GET, "/libraries/getAllLibraries").permitAll()

                        // Yazarlar listesine GET metodu ile herkese izin ver
                        .requestMatchers(HttpMethod.GET, "/authors/getAllAuthor").permitAll()

                        // Kütüphane ekleme POST, kimlik doğrulama gerektirir
                        .requestMatchers(HttpMethod.POST, "/libraries/addLibrary").authenticated()

                        // Kitap ekleme POST, kimlik doğrulama gerektirir
                        .requestMatchers(HttpMethod.POST, "/books/addBook").authenticated()

                        // Yukarıdaki kurallarla eşleşmeyen tüm diğer yollar kimlik doğrulama gerektirir
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    // CORS yapılandırması eklendi
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // React frontend'in portu
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
