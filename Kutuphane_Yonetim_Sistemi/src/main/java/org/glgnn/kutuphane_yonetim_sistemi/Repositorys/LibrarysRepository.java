package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibrarysRepository extends JpaRepository<Librarys, Long> {
    List<Librarys> findAllByOrderByNameAsc();
    Page<Librarys> findByStatusTrue(Pageable  pageable);
    List<Librarys> findByStatusFalse();
    Librarys save(Librarys library);
    @Query("SELECT l FROM Librarys l WHERE LOWER(l.name) LIKE LOWER(CONCAT(:keyword, '%')) AND l.status = true")
    List<Librarys> findByNameStartingWithLibrays(@Param("keyword") String keyword);
}
