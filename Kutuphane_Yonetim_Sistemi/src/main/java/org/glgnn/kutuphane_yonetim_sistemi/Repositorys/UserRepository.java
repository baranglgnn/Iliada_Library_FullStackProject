package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;


import org.glgnn.kutuphane_yonetim_sistemi.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}
