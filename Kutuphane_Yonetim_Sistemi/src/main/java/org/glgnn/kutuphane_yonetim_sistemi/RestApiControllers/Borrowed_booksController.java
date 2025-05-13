package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Borrowed_booksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequestMapping("/borrowed")
    public class Borrowed_booksController {
     public final Borrowed_booksService borrowed_booksService;

     @Autowired
        public Borrowed_booksController(Borrowed_booksService borrowedBooksService) {
            borrowed_booksService = borrowedBooksService;
        }
           @GetMapping("/isBookBorrowed/{citizenId}/{bookId}")
           public boolean isBookBorrowed(@PathVariable Long citizenId, @PathVariable Long bookId) {
           return borrowed_booksService.isBookBorrowedByCitizen(citizenId, bookId);
          }

        @GetMapping("/countActiveBorrowed/{citizenId}")
        public Long countActiveBorrowedBooks(@PathVariable Long citizenId) {
            return borrowed_booksService.countActiveBorrowedBooksByCitizen(citizenId);
        }

        @GetMapping("/activeBorrowedBooks/{citizenId}")
        public List<Books> getActiveBorrowedBooks(@PathVariable Long citizenId) {
            return borrowed_booksService.getActiveBorrowedBooks(citizenId);
        }


        @PostMapping("/borrow/{citizenId}/{bookId}/{libraryId}")
        public ResponseEntity<?> borrowBook(@PathVariable Long citizenId, @PathVariable Long bookId,@PathVariable  Long libraryId) {
            try {
                return ResponseEntity.ok(borrowed_booksService.borrowBook(citizenId, bookId,libraryId));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body("Hata: " + e.getMessage());
            }
        }


        @PostMapping("/return/{citizenId}/{bookId}")
        public ResponseEntity<?> returnBook(@PathVariable Long citizenId, @PathVariable Long bookId) {
            try {
                return ResponseEntity.ok(borrowed_booksService.returnBook(citizenId, bookId));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body("Hata: " + e.getMessage());
            }
        }

        @GetMapping("/getAllBorrowedBooks")
        public ResponseEntity<List<Object[]>> getAllBorrowedBooks() {
            return ResponseEntity.ok(borrowed_booksService.getAllBorrowedBooks());
        }


}
