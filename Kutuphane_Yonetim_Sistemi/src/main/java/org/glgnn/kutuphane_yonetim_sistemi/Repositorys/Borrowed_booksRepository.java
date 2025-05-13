package org.glgnn.kutuphane_yonetim_sistemi.Repositorys;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Borrowed_books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Borrowed_booksRepository extends JpaRepository<Borrowed_books,Long> {
    boolean existsByCitizenIdAndBookIdAndReturnDateIsNull(Long citizenId, Long bookId);
    Long countByCitizenIdAndReturnDateIsNull(Long citizenId);
    @Query("SELECT bb.book FROM Borrowed_books bb WHERE bb.citizen.id = :citizenId AND bb.returnDate IS NULL")
    List<Books> findActiveBorrowedBooksByCitizenId(@Param("citizenId") Long citizenId);
    Borrowed_books findByCitizenIdAndBookIdAndReturnDateIsNull(Long citizenId, Long bookId);
    @Query("SELECT bb.id, c.fullName, b.title, a.name, l.name, l.address " +
            "FROM Borrowed_books bb " +
            "JOIN bb.citizen c " +
            "JOIN bb.book b " +
            "JOIN b.author a " +
            "JOIN bb.library l")
    List<Object[]> findAllBorrowedBooksRaw();

}
