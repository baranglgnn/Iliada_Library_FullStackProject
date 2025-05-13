package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AuthorsRepository extends JpaRepository<Authors, Long> {
    Page<Authors> findByStatusTrue(Pageable pageable);
    Page<Authors> findByStatusFalse(Pageable pageable);
    Authors save(Authors author);

}
