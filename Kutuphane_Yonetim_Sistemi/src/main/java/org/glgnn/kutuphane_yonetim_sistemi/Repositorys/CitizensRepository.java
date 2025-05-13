package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;


import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitizensRepository extends JpaRepository<Citizens, Long> {
    Page<Citizens> findByStatusTrue(Pageable pageable);
    List<Citizens> findByStatusFalse();
    Citizens save(Citizens citizen);
    Citizens findByTcNo(String tcNo);

}
