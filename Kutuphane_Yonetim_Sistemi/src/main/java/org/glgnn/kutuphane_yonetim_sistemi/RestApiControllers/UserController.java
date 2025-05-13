package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.Enum.Role;
import org.glgnn.kutuphane_yonetim_sistemi.JWT.JwtUtil;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Hashleme için ihtiyacımız var

    public UserController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String roleStr = request.get("role");

        if (email == null || password == null || roleStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, password ve role alanları zorunludur"));
        }

        // Rol kontrolü
        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Geçersiz rol! Kullanılabilir roller: USER, ADMIN"));
        }

        // Aynı email var mı?
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu email zaten kayıtlı"));
        }

        // Şifreyi HASHLE!
        String hashedPassword = passwordEncoder.encode(password);

        // Veritabanına kaydet
        Users user = new Users(email, hashedPassword, role);
        userRepository.save(user);

        // Token üret
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping(   "/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email ve password zorunludur"));
        }

        // AuthenticationManager -> DaoAuthenticationProvider -> UserDetailsService
        // email ile user'ı bulur, password'u karşılaştırır
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException ex) {
            // Şifre eşleşmezse veya kullanıcı yoksa
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Geçersiz kimlik bilgileri"));
        }

        // Doğrulama başarılıysa token üretip dön
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }
}