package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.Enum.Role;

import java.util.Optional;

public interface UserService {
    Optional<Users> findByEmail(String email);
    Users registerUser(String email, String password, Role role);
}