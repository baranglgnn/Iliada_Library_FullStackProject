package org.glgnn.kutuphane_yonetim_sistemi.JwtFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.JWT.JwtUtil;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Autowired
    public JwtAuthFilter(JwtUtil jwtUtil, @Lazy UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // /auth/** altındaki endpoint'ler için JWT kontrolü atla
        if (request.getRequestURI().startsWith("/auth/")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateToken(token)) {
                try {
                    // Token geçerliyse email ve claim içindeki role bilgisini al
                    String email = jwtUtil.getEmailFromToken(token);

                    // Bizim JwtUtil sadece subject(email) döndürüyor. Role bilgisini JWT payload
                    // içine eklemediğimiz için, doğrudan veritabanından Users objesini çekiyoruz:
                    Users user = userService.findByEmail(email)
                            .orElse(null);

                    if (user != null) {
                        // Tek bir role olduğu için basitçe List.of(...) ile GrantedAuthority oluşturuyoruz
                        List<SimpleGrantedAuthority> authorities = List.of(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        );

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(user, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (JwtException ex) {
                    // Token doğrulama hatası (expired, malformed vs.) durumunda context'e kimlik bilgisi ekleme
                }
            }
        }
        chain.doFilter(request, response);
    }
}
