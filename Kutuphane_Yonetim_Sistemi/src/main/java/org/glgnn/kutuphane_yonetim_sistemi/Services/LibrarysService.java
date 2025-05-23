package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface LibrarysService {
    Page<Librarys> getAllActiveLibraries(Pageable pageable);
    Librarys findLibraryById(Long id);
    List<Librarys> deletedLibraries();
    Librarys saveLibrary(String name, String address);
    Librarys updateLibrary(Long id, Librarys library);
    Librarys deleteLibraryById(Long id);
    List<Librarys> findAllLibrariesByName(String keyword);
    Librarys addBookToLibrary(Long libraryId, Long bookId);
    void removeBookFromLibrary(Long libraryId, Long bookId);
    List<Books> getBooksByLibraryId(Long libraryId);
    boolean isBookInLibrary(Long libraryId, Long bookId);
    List<Object[]> getLibrariesAndBooksByAuthor(Long authorId);
    Page<Librarys> findAllLibraryBooks(Pageable pageable);
    List<Authors> getAuthorsByLibraryId(Long libraryId);
    Page<Librarys> findAllLibraryAuthors(Pageable pageable);

}
