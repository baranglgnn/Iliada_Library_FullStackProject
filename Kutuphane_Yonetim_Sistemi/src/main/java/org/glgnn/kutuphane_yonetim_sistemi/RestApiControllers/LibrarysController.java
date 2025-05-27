package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.Services.LibrarysService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kutuphane")
public class LibrarysController {
    public final LibrarysService libService;
    public final UserService userService;

    @Autowired
    public LibrarysController(LibrarysService libService, UserService userService) {
        this.libService = libService;
        this.userService = userService;
    }

    @GetMapping("/getAllLibraries")
    public ResponseEntity<Page<Librarys>> getAllLibraries(Pageable  pageable)
    {
        Page<Librarys> librarysPage = libService.getAllActiveLibraries(pageable);
        return ResponseEntity.ok(librarysPage);
    }

    @GetMapping("/getLibrary/{id}")
    public ResponseEntity<?> getLibrary(@PathVariable Long id) {
        try {
            Librarys library = libService.findLibraryById(id);
            return ResponseEntity.ok(library);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/deleted")
    public ResponseEntity<List<Librarys>> deletedLibraries()
    {
        return ResponseEntity.ok(libService.deletedLibraries());

    }

    @PostMapping("deleteLibrary/{id}")
    public ResponseEntity<?> deleteLibrary(@PathVariable Long id) {
        try {
            Librarys deleted = libService.deleteLibraryById(id);
            return ResponseEntity.ok(deleted);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/saveLibrary")
    public ResponseEntity<Librarys> saveLibrary(@RequestBody Librarys library)
    {
        return ResponseEntity.ok(libService.saveLibrary(library.getName(), library.getAddress()));
    }

    @PutMapping("/updateLibrary/{id}")
    public ResponseEntity<?> updateLibrary(@PathVariable Long id, @RequestBody Librarys library) {
        try {
            Librarys updatedLibrary = libService.updateLibrary(id, library);
            return ResponseEntity.ok(updatedLibrary);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/searchLibrary")
    public List<Librarys> searchLibraryByName(@RequestParam("name") String keyword) {
        return libService.findAllLibrariesByName(keyword);
    }

    @PostMapping("/addBookToLibrary/{bookId}/{libraryId}")
    public ResponseEntity<?> addBookToLibrary(@PathVariable Long bookId, @PathVariable Long libraryId) {
        try {
            Librarys library = libService.addBookToLibrary(libraryId, bookId);
            return ResponseEntity.ok(library);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/isBookInLibrary/{libraryId}/{bookId}")
    public boolean isBookInLibrary(@PathVariable Long libraryId, @PathVariable Long bookId) {
        return libService.isBookInLibrary(libraryId, bookId);
    }

    @GetMapping("/getLibrariesAndBooksByAuthor/{authorId}")
    public List<Object[]> getLibrariesAndBooksByAuthor(@PathVariable Long authorId) {
        return libService.getLibrariesAndBooksByAuthor(authorId);
    }
    @GetMapping("/getAllLibraryBook")
    public ResponseEntity<Page<Librarys>> getAllLibraryBooks(Pageable pageable) {
        Page<Librarys> libraryBooks = libService.findAllLibraryBooks(pageable);
        return ResponseEntity.ok(libraryBooks);
    }
    @GetMapping("getAuthorsByLibrary/{libraryId}")
    public ResponseEntity<List<Authors>> getAuthorsByLibrary(@PathVariable Long libraryId) {
        List<Authors> authors = libService.getAuthorsByLibraryId(libraryId);
        return ResponseEntity.ok(authors);
    }

}
