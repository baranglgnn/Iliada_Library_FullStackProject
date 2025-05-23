package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibrarysRepository extends JpaRepository<Librarys, Long> {

    List<Librarys> findAllByOrderByNameAsc();

    Page<Librarys> findByStatusTrue(Pageable pageable);

    List<Librarys> findByStatusFalse();

    Librarys save(Librarys library);

    @Query("SELECT l FROM Librarys l WHERE LOWER(l.name) LIKE LOWER(CONCAT(:keyword, '%')) AND l.status = true")
    List<Librarys> findByNameStartingWithLibrays(@Param("keyword") String keyword);

    @Query("SELECT l.authors FROM Librarys l WHERE l.id = :libraryId")
    List<Authors> findAuthorsByLibraryId(@Param("libraryId") Long libraryId);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Librarys l JOIN l.authors a WHERE l.id = :libraryId AND a.id = :authorId")
    boolean existsAuthorInLibrary(@Param("libraryId") Long libraryId, @Param("authorId") Long authorId);

    @Query("SELECT l.books FROM Librarys l WHERE l.id = :libraryId")
    List<Books> findBooksByLibraryId(@Param("libraryId") Long libraryId);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Librarys l JOIN l.books b WHERE l.id = :libraryId AND b.id = :bookId")
    boolean existsBookInLibrary(@Param("libraryId") Long libraryId, @Param("bookId") Long bookId);

    @Query("SELECT l.name, b.title FROM Librarys l JOIN l.books b WHERE b.author.id = :authorId ORDER BY l.name, b.title")
    List<Object[]> getLibrariesAndBooksByAuthor(@Param("authorId") Long authorId);
    @Query("""
        SELECT l.id, l.name, b.id, b.title
        FROM Librarys l
        JOIN l.books b
        ORDER BY l.name, b.title
    """)
    Page<Librarys> findAllLibraryBooks(Pageable pageable);
    @Query("""
       SELECT l.id, l.name, a.id, a.name
       FROM Librarys l
       JOIN l.authors a
       ORDER BY l.name, a.name
    """)
    Page<Librarys> findAllLibraryAuthors(Pageable pageable);
    @Query("select l from Librarys l join fetch l.authors where l.id = :libraryId")
    Optional<Librarys> findWithAuthorsById(@Param("libraryId") Long libraryId);
}

