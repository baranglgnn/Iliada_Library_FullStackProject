package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Borrowed_books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.BusinessException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.BorrowedBooksErrorMessages;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.BooksRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.Borrowed_booksRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.CitizensRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.LibrarysRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Borrowed_booksService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class Borrowed_booksServiceImpl implements Borrowed_booksService {
    public final Borrowed_booksRepository borrowedRepo;
    public final BooksRepository bookRepo;
    public final CitizensRepository citizensRepo;
    public final LibrarysRepository libraryRepo;

    @Autowired
    public Borrowed_booksServiceImpl(Borrowed_booksRepository borrowedRepo,
                                     BooksRepository bookRepo,
                                     CitizensRepository citizensRepo,
                                     LibrarysRepository libraryRepo) {

       this.borrowedRepo = borrowedRepo;
        this.bookRepo = bookRepo;
        this.citizensRepo = citizensRepo;
        this.libraryRepo = libraryRepo;

    }

    @Override
    @Transactional
    public boolean isBookBorrowedByCitizen(Long citizenId, Long bookId) {
        return borrowedRepo.existsByCitizenIdAndBookIdAndReturnDateIsNull(citizenId, bookId);
    }

    @Override
    @Transactional
    public Long countActiveBorrowedBooksByCitizen(Long citizenId) {
        return borrowedRepo.countByCitizenIdAndReturnDateIsNull(citizenId);
    }

    @Override
    @Transactional
    public List<Books> getActiveBorrowedBooks(Long citizenId) {
        return borrowedRepo.findActiveBorrowedBooksByCitizenId(citizenId);
    }

    @Override
    @Transactional
    public Borrowed_books borrowBook(Long citizenId, Long bookId, Long libraryId) {
        Citizens citizentmp = citizensRepo.findById(citizenId)
                .orElseThrow(() -> new NotFoundException(BorrowedBooksErrorMessages.CITIZEN_NOT_FOUND));

        Books booktmp = bookRepo.findById(bookId)
                .orElseThrow(() -> new NotFoundException(BorrowedBooksErrorMessages.BOOK_NOT_FOUND));

        Librarys librarytmp = libraryRepo.findById(libraryId)
                .orElseThrow(() -> new NotFoundException(BorrowedBooksErrorMessages.LIBRARY_NOT_FOUND));

        boolean isBookBorrowed = borrowedRepo.existsByCitizenIdAndBookIdAndReturnDateIsNull(citizenId, bookId);
        if (isBookBorrowed) {
            throw new BusinessException(BorrowedBooksErrorMessages.BOOK_ALREADY_BORROWED);
        }

        Borrowed_books borrowedBook = new Borrowed_books();
        borrowedBook.setCitizen(citizentmp);
        borrowedBook.setBook(booktmp);
        borrowedBook.setLibrary(librarytmp);
        borrowedBook.setBorrowDate(LocalDate.now());

        return borrowedRepo.save(borrowedBook);
    }

        @Override
        @Transactional
        public Borrowed_books returnBook(Long citizenId, Long bookId) {
            Borrowed_books borrowedBook = borrowedRepo.findByCitizenIdAndBookIdAndReturnDateIsNull(citizenId, bookId);

            if (borrowedBook == null) {
                throw new BusinessException(BorrowedBooksErrorMessages.BOOK_NOT_BORROWED);
            }
            borrowedBook.setReturnDate(LocalDate.now());

            return borrowedRepo.save(borrowedBook);
        }

    @Override
    public List<Object[]> getAllBorrowedBooks() {
        return borrowedRepo.findAllBorrowedBooksRaw();
    }
}

