package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_author;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Library_authorRepository extends JpaRepository<Library_author, Long> {
    List<Library_author> findByLibraryId(Long libraryId);
    @Query("SELECT la.library FROM Library_author la WHERE la.author.id = :authorId ORDER BY la.library.name ASC")
    List<Librarys> findLibrariesByAuthorId(@Param("authorId") Long authorId);
    boolean existsByLibraryIdAndAuthorId(Long id, Long id1);
    @Query("SELECT la FROM Library_author la JOIN FETCH la.author a JOIN FETCH la.library l")
    List<Library_author> findAllLibraryAuthors();
}

