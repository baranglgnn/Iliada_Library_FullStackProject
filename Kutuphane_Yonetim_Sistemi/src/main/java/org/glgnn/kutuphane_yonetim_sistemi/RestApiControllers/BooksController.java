package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.Services.BooksService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BooksController {
    public final BooksService bookService;
    public final UserService userService;

    @Autowired
    public BooksController(BooksService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    @GetMapping("/getAllBooks")
    public ResponseEntity<Page<Books>> getAllBooksPageable(Pageable pageable) {
        Page<Books> bookPage = bookService.getAllActiveBooks(pageable);
        return ResponseEntity.ok(bookPage);
    }

    @GetMapping("/getBook/{id}")
    public ResponseEntity<?> getBook(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(bookService.findBookById(id));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/deleted")
    public ResponseEntity<List<Books>> deletedBooks()
    {
        return ResponseEntity.ok(bookService.deletedBooks());
    }

    @GetMapping("/sortedBook")
    public List<Books> getBooksSorted()
    {
        return bookService.getAllBooksSorted();
    }

    @GetMapping("/book-author/{authorId}")
    public ResponseEntity<List<Books>> getBooksByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(bookService.GetBooksByAuthor(authorId));
    }

    @PostMapping("/addBook")
    public Books addBook(@RequestBody Books newBook) {
          return bookService.addBook(newBook.getTitle(),newBook.getAuthor().getId());
    }

    @PostMapping("/deleteBook/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            Books deletedBook = bookService.deleteBook(id);
            return ResponseEntity.ok(deletedBook);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/updateBook/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Books books) {
        try {
            Books updatedBook = bookService.updateBook(id, books);
            return ResponseEntity.ok(updatedBook);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/searchBooks")
    public List<Books> searchBooksByTitle(@RequestParam("title") String keyword) {
        return bookService.findBooksByTitlePrefix(keyword);
    }
}
