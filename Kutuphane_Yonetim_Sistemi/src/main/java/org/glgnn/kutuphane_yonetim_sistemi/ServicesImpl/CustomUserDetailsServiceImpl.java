package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.glgnn.kutuphane_yonetim_sistemi.Enum.Role;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())) döndürüyoruz
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return new User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
