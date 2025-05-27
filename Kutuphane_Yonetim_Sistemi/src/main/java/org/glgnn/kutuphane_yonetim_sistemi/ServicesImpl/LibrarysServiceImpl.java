package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.ConflictException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.BookErrorMessages;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.BooksRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.LibrarysRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.LibrarysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.LibraryErrorMessages;



import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibrarysServiceImpl implements LibrarysService {
    public final LibrarysRepository librarysRepo;
    public final BooksRepository booksRepo;

    @Autowired
    public LibrarysServiceImpl(LibrarysRepository librarysRepo,BooksRepository booksRepo)
    {
        this.librarysRepo = librarysRepo;
        this.booksRepo = booksRepo;
    }

    @Override
    @Transactional
    public Page<Librarys> getAllActiveLibraries(Pageable pageable) {
        return librarysRepo.findByStatusTrue(pageable);
    }

    @Override
    @Transactional
    public Librarys findLibraryById(Long id) {
        return librarysRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(LibraryErrorMessages.LIBRARY_NOT_FOUND));
    }

    @Override
    @Transactional
    public List<Librarys> deletedLibraries() {
        return librarysRepo.findByStatusFalse();
    }

    @Override
    @Transactional
    public Librarys saveLibrary(String name, String address) {
        Librarys savedLibrary = new Librarys(name,address);
        return librarysRepo.save(savedLibrary);
    }

    @Transactional
    public Librarys updateLibrary(Long id, Librarys newLibraryData) {
        return librarysRepo.findById(id)
                .map(existingLibrary -> {
                    existingLibrary.setName(newLibraryData.getName());
                    existingLibrary.setAddress(newLibraryData.getAddress());
                    return librarysRepo.save(existingLibrary);
                })
                .orElseThrow(() -> new RuntimeException("Kutuphane bulunamadi!"));
    }

    @Override
    @Transactional
    public Librarys deleteLibraryById(Long id) {
        Librarys deletedLibrary = librarysRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(LibraryErrorMessages.LIBRARY_DELETE_NOT_FOUND));

        deletedLibrary.setStatus(false);
        return librarysRepo.save(deletedLibrary);
    }

    @Override
    public List<Librarys> findAllLibrariesByName(String keyword) {
        return librarysRepo.findByNameStartingWithLibrays(keyword);
    }

    @Override
    @Transactional
    public Librarys addBookToLibrary(Long libraryId, Long bookId) {
        Librarys library = librarysRepo.findById(libraryId)
                .orElseThrow(() -> new NotFoundException(LibraryErrorMessages.LIBRARY_NOT_FOUND));

        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new NotFoundException(BookErrorMessages.BOOK_NOT_FOUND));

        if (library.getBooks().contains(book)) {
            throw new ConflictException(BookErrorMessages.BOOK_ALREADY_EXISTS);
        }

        library.getBooks().add(book);

        Authors author = book.getAuthor();
        if (author != null && !library.getAuthors().contains(author)) {
            library.getAuthors().add(author);
        }

        return librarysRepo.save(library);
    }


    @Override
    @Transactional
    public void removeBookFromLibrary(Long libraryId, Long bookId) {
        // 1) Kütüphane ve kitap var mı?
        if (!librarysRepo.existsBookInLibrary(libraryId, bookId)) {
            throw new RuntimeException("Bu kitap bu kütüphanede kayıtlı değil!");
        }

        Librarys library = librarysRepo.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("Kütüphane bulunamadı!"));
        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadı!"));

        // 2) ManyToMany listesinden çıkar
        library.getBooks().remove(book);

        Long authorId = book.getAuthor().getId();
        boolean stillHas = librarysRepo.existsAuthorInLibrary(libraryId, authorId);
        if (!stillHas) {
            library.getAuthors().removeIf(a -> a.getId().equals(authorId));
        }

        librarysRepo.save(library);
    }

    @Override
    @Transactional
    public List<Books> getBooksByLibraryId(Long libraryId) {
        return librarysRepo.findBooksByLibraryId(libraryId)
                .stream()
                .filter(Books::isStatus)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean isBookInLibrary(Long libraryId, Long bookId) {
        return librarysRepo.existsBookInLibrary(libraryId, bookId);
    }
    @Override
    @Transactional
    public List<Object[]> getLibrariesAndBooksByAuthor(Long authorId) {
        return librarysRepo.getLibrariesAndBooksByAuthor(authorId);
    }
    @Override
    @Transactional
    public Page<Librarys> findAllLibraryBooks(Pageable pageable) {
        return librarysRepo.findAllLibraryBooks(pageable);
    }
    @Override
    @Transactional
    public Page<Librarys> findAllLibraryAuthors(Pageable pageable) {
        return librarysRepo.findAllLibraryAuthors(pageable);
    }
    @Override
    public List<Authors> getAuthorsByLibraryId(Long libraryId) {
        Librarys library = librarysRepo.findWithAuthorsById(libraryId)
                .orElseThrow(() -> new RuntimeException("Library not found with id: " + libraryId));
        return library.getAuthors();
    }
}

