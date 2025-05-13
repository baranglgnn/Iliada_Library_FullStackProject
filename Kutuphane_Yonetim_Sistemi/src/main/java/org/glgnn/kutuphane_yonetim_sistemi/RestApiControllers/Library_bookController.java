package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_book;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Library_bookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Kutuphane-kitap")
public class Library_bookController {

    public final Library_bookService library_bookService;

    @Autowired
    public Library_bookController(Library_bookService libraryBookService) {
        library_bookService = libraryBookService;
    }

    @GetMapping("/isBookInLibrary/{libraryId}/{bookId}")
    public boolean isBookInLibrary(@PathVariable Long libraryId, @PathVariable Long bookId) {
        return library_bookService.isBookInLibrary(libraryId, bookId);
    }

    @GetMapping("/getLibrariesAndBooksByAuthor/{authorId}")
    public List<Object[]> getLibrariesAndBooksByAuthor(@PathVariable Long authorId) {
        return library_bookService.getLibrariesAndBooksByAuthor(authorId);
    }

    @PostMapping("/addBookToLibrary/{bookId}/{libraryId}")
    public ResponseEntity<?> addBookToLibrary(@PathVariable Long bookId, @PathVariable Long libraryId) {
        try {
            return ResponseEntity.ok(library_bookService.addBookToLibrary(bookId, libraryId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getAllLibraryBook")
    public ResponseEntity<List<Library_book>> getAllLibraryBooks() {
        List<Library_book> libraryBooks = library_bookService.getAllLibraryBooks();
        return ResponseEntity.ok(libraryBooks);
    }
}
