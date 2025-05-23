package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AuthorsRepository extends JpaRepository<Authors, Long> {

    Page<Authors> findByStatusTrue(Pageable pageable);

    Page<Authors> findByStatusFalse(Pageable pageable);

    Authors save(Authors author);

    @Query("SELECT a FROM Authors a WHERE LOWER(a.name) LIKE LOWER(CONCAT(:keyword, '%')) AND a.status = true")
    List<Authors> findByNameStartingWith(@Param("keyword") String keyword);

    @Query("SELECT a.libraries FROM Authors a WHERE a.id = :authorId")
    List<Librarys> findLibrariesByAuthorId(@Param("authorId") Long authorId);
}

