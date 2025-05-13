package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_book;

import java.util.List;

public interface Library_bookService {
    boolean isBookInLibrary(Long libraryId, Long bookId);
    List<Object[]> getLibrariesAndBooksByAuthor(Long authorId);
     Library_book addBookToLibrary(Long bookId, Long libraryId);
    List<Library_book> getAllLibraryBooks();

}
