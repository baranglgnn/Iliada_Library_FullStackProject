package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface BooksService {
    Page<Books> getAllActiveBooks(Pageable pageable);
    Books findBookById(Long id);
    List<Books> deletedBooks();
    Books updateBook(Long id, Books book);
    Books addBook(String title, Long authorId);
    Books deleteBook(Long id);
    List<Books> getAllBooksSorted();
    List<Books> getBooksByAuthor(Long authorId);

    List<Books> GetBooksByAuthor(Long authorId);

    List<Books> findBooksByTitlePrefix(String keyword);
}
