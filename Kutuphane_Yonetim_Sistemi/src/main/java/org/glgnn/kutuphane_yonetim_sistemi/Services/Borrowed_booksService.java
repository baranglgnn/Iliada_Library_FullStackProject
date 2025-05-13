package org.glgnn.kutuphane_yonetim_sistemi.Services;


import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Borrowed_books;

import java.util.List;

public interface Borrowed_booksService {
    boolean isBookBorrowedByCitizen(Long citizenId, Long bookId);
    Long countActiveBorrowedBooksByCitizen(Long citizenId);
    List<Books> getActiveBorrowedBooks(Long citizenId);
    Borrowed_books borrowBook(Long citizenId, Long bookId,Long libraryId);
    Borrowed_books returnBook(Long citizenId, Long bookId);
    List<Object[]> getAllBorrowedBooks();
}
