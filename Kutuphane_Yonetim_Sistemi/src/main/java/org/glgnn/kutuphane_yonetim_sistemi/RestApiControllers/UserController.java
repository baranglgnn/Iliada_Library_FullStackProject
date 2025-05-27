package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.Enum.Role;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.UserErrorMessages;
import org.glgnn.kutuphane_yonetim_sistemi.JWT.JwtUtil;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.UserRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
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
    private final UserService userService;
    private final PasswordEncoder passwordEncoder; // Hashleme için ihtiyacımız var

    public UserController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String roleStr = request.get("role");

        try {
            if (email == null || password == null || roleStr == null) {
                throw new IllegalArgumentException(UserErrorMessages.MISSING_FIELDS);
            }

            Role role;
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(UserErrorMessages.INVALID_ROLE);
            }

            Users user = userService.registerUser(email, password, role);
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of("token", token));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", UserErrorMessages.MISSING_FIELDS));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", UserErrorMessages.INVALID_CREDENTIALS));
        }
    }
}