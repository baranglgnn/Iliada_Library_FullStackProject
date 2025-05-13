package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Services.BooksService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Books getBook(@PathVariable("id") Long id)
    {
        return bookService.findBookById(id);
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
    public ResponseEntity<?> deleteBook(@PathVariable Long id )
    {
        try{
            return ResponseEntity.ok(bookService.deleteBook(id));
        }catch (RuntimeException e)
        {
            return ResponseEntity.badRequest().body("Hata"+e.getMessage());
        }
    }
    @PutMapping("/updateBook/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Books books)
    {
        try
        {
            return ResponseEntity.ok(bookService.updateBook(id,books));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body("Hata"+e.getMessage());
        }
    }

}
