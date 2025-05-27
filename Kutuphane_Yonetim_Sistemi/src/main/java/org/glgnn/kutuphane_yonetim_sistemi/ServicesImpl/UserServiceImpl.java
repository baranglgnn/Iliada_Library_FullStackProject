package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.Enum.Role;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.UserErrorMessages;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.UserRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Users registerUser(String email, String password, Role role) {
        if (email == null || password == null || role == null) {
            throw new IllegalArgumentException(UserErrorMessages.MISSING_FIELDS);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException(UserErrorMessages.USER_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(password);
        Users newUser = new Users(email, encodedPassword, role);
        return userRepository.save(newUser);
    }


    @Override
    public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}