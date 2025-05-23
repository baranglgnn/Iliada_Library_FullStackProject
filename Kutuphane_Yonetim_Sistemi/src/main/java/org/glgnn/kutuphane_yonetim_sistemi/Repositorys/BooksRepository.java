package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public interface BooksRepository extends JpaRepository<Books, Long> {

    List<Books> findAllByOrderByTitleAsc();

    Page<Books> findByStatusTrue(Pageable pageable);

    List<Books> findByStatusFalse();

    List<Books> findByAuthorId(Long authorId);

    Books save(Books book);

    @Query("SELECT b FROM Books b WHERE LOWER(b.title) LIKE LOWER(CONCAT(:keyword, '%')) AND b.status = true")
    List<Books> findByTitleStartingWith(@Param("keyword") String keyword);

    @Query("SELECT b.libraries FROM Books b WHERE b.id = :bookId")
    List<Librarys> findLibrariesByBookId(@Param("bookId") Long bookId);
}
