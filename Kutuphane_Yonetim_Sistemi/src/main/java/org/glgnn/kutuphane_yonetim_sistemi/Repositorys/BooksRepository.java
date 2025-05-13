package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public interface BooksRepository extends JpaRepository<Books, Long> {
    List<Books> findAllByOrderByTitleAsc();
    Page<Books> findByStatusTrue(Pageable pageable);
    List<Books> findByStatusFalse();
    List<Books> findByAuthorId(Long authorId);
    Books save(Books book);

}
