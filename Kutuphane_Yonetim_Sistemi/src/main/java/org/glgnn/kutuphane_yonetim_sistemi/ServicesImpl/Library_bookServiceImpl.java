package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.*;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.BooksRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.Library_authorRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.Library_bookRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.LibrarysRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Library_bookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Library_bookServiceImpl implements Library_bookService {

    public final Library_bookRepository library_bookRepo;
    public final BooksRepository booksRepo;
    public final LibrarysRepository librarysRepo;
    public final Library_authorRepository library_authorRepo;


    @Autowired
    public Library_bookServiceImpl(Library_bookRepository libraryBookRepo, BooksRepository booksRepo, LibrarysRepository librarysRepo, Library_authorRepository libraryAuthorRepo) {
        this.library_bookRepo = libraryBookRepo;
        this.booksRepo = booksRepo;
        this.librarysRepo = librarysRepo;
        this.library_authorRepo = libraryAuthorRepo;
    }

    @Override
    @Transactional
    public boolean isBookInLibrary(Long libraryId, Long bookId) {
        return library_bookRepo.existsByLibraryIdAndBookId(libraryId, bookId);
    }

    @Override
    @Transactional
    public List<Object[]> getLibrariesAndBooksByAuthor(Long authorId) {
        return library_bookRepo.getLibrariesAndBooksByAuthor(authorId);
    }

    @Override
    @Transactional
    public Library_book addBookToLibrary(Long bookId, Long libraryId) {

        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadi!"));
        Librarys library = librarysRepo.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("Kütüphane bulunamadi!"));

        if (library_bookRepo.existsByLibraryIdAndBookId(libraryId, bookId)) {
            throw new RuntimeException("Bu kitap zaten bu kutuphanede mevcut!");
        }

        Library_book libraryBook = new Library_book();
        libraryBook.setLibrary(library);
        libraryBook.setBook(book);
        library_bookRepo.save(libraryBook);

        Authors author = book.getAuthor();
        if (!library_authorRepo.existsByLibraryIdAndAuthorId(library.getId(), author.getId())) {
            Library_author libraryAuthor = new Library_author();
            libraryAuthor.setLibrary(library);
            libraryAuthor.setAuthor(author);
            library_authorRepo.save(libraryAuthor);
        }


        return libraryBook;

    }

    @Override
    @Transactional
    public Page<Library_book> getAllLibraryBooks(Pageable pageable) {
        return library_bookRepo.findAllLibraryBooks(pageable);
    }
}

