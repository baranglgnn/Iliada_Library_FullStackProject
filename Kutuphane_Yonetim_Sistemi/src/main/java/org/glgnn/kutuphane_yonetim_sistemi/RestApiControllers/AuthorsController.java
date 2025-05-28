package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Services.AuthorsService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorsController {
    public final AuthorsService authorsService;
    public final UserService userService;

    public AuthorsController(AuthorsService authorsService, UserService userService) {
        this.authorsService = authorsService;
        this.userService = userService;
    }

    @GetMapping("/getAllAuthor")
    public ResponseEntity<Page<Authors>> getAllActiveAuthorsPageable(Pageable pageable) {
        Page<Authors> authorPage = authorsService.getAllActiveAuthors(pageable);
        return ResponseEntity.ok(authorPage);

    }
    @GetMapping("/getAuthor/{id}")
    public Authors getAuthorById(@PathVariable Long id)
    {
        return authorsService.getAuthorById(id);
    }

    @GetMapping("/getDeletedAuthors")
    public ResponseEntity<Page<Authors>> getAllDeletedAuthorsPageable(Pageable pageable)
    {
        Page<Authors> authorPage = authorsService.getAllActiveAuthors(pageable);
        return ResponseEntity.ok(authorPage);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/deleteAuthor/{id}")
    public ResponseEntity<Authors> deleteAuthor(@PathVariable Long id) {
        return ResponseEntity.ok(authorsService.deleteAuthor(id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/saveAuthor")
    public ResponseEntity<Authors> saveAuthor(@RequestBody Authors author)
    {
        Authors savedAuthor = new Authors(author.getName());
        return ResponseEntity.ok(authorsService.saveAuthor(savedAuthor));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateAuthor/{id}")
    public ResponseEntity<Authors> updateAuthor(@PathVariable Long id, @RequestBody Authors author) {
        Authors updateAuthor = authorsService.getAuthorById(id);
        updateAuthor.setName(author.getName());
        return ResponseEntity.ok(authorsService.updateAuthor(id, updateAuthor));
    }

    @GetMapping("/searchAuthors")
    public List<Authors> searchAuthorByName(@RequestParam("name") String keyword) {
        return authorsService.getAuthorsByName(keyword);
    }


}
