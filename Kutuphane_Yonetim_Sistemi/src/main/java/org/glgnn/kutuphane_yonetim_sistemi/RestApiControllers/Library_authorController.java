package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_author;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Library_authorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/kutuphane-yazar")
public class Library_authorController {
    public final Library_authorService library_authorService;

    @Autowired
    public Library_authorController(Library_authorService libraryAuthorService) {
        library_authorService = libraryAuthorService;
    }

    @GetMapping("/getAuthorsByLibrary/{libraryId}")
    public List<Library_author> getAuthorsByLibrary(@PathVariable Long libraryId) {
        return library_authorService.getAuthorsByLibraryId(libraryId);
    }

    @GetMapping("/getLibrariesByAuthor/{authorId}")
    public List<Librarys> getLibrariesByAuthor(@PathVariable Long authorId) {
        return library_authorService.getLibrariesByAuthorId(authorId);
    }
    @GetMapping("/getAllLibraryBook")
    public ResponseEntity<List<Library_author>> getAllLibraryAuthors() {
        List<Library_author> libraryAuthors = library_authorService.getAllLibraryAuthors();
        return ResponseEntity.ok(libraryAuthors);
    }

}
