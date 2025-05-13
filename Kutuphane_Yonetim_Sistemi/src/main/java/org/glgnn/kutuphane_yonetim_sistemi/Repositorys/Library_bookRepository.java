package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Library_bookRepository extends JpaRepository<Library_book,Long> {
    boolean existsByLibraryIdAndBookId(Long libraryId, Long bookId);
    @Query("SELECT lb.library.name, lb.book.title FROM Library_book lb WHERE lb.book.author.id = :authorId ORDER BY lb.library.name, lb.book.title")
    List<Object[]> getLibrariesAndBooksByAuthor(@Param("authorId") Long authorId);
    @Query("SELECT lb FROM Library_book lb JOIN FETCH lb.book b JOIN FETCH lb.library l")
    List<Library_book> findAllLibraryBooks();
}
