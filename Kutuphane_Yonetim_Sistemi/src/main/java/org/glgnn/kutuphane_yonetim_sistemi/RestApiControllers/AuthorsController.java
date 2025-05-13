package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Services.AuthorsService;
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
@RequestMapping("/authors")
public class AuthorsController {
    public final AuthorsService authorsService;
    public final UserService userService;

    @Autowired
    public AuthorsController(AuthorsService authorsService, UserService userService) {
        this.authorsService = authorsService;
        this.userService = userService;
    }
    @GetMapping("/getAllAuthor")
    public ResponseEntity<Page<Authors>> getAllActiveAuthorsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Authors> authorPage = authorsService.getAllActiveAuthors(pageable);
        return ResponseEntity.ok(authorPage);
    }
    @GetMapping("/getAuthor/{id}")
    public Authors getAuthorById(@PathVariable Long id)
    {
        return authorsService.getAuthorById(id);
    }
    public ResponseEntity<Page<Authors>> getAllDeletedAuthorsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Authors> authorPage = authorsService.deletedAuthors(pageable);
        return ResponseEntity.ok(authorPage);
    }
    @PostMapping("/deleteAuthor/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable Long id){
        try{
            return ResponseEntity.ok(authorsService.deleteAuthor(id));
        }catch(RuntimeException e)
        {
            return ResponseEntity.badRequest().body("HAta"+e.getMessage());
        }
    }
    @PostMapping("/saveAuthor")
    public ResponseEntity<Authors> saveAuthor(@RequestBody Authors author)
    {
        Authors savedAuthor = new Authors(author.getName());
        return ResponseEntity.ok(authorsService.saveAuthor(savedAuthor));
    }
    @PutMapping("/updateAuthor/{id}")
    public ResponseEntity<?> updateAuthor(@PathVariable Long id, @RequestBody Authors author)
    {
        try {
            Authors updateAuthor = authorsService.getAuthorById(id);
            updateAuthor.setName(author.getName());
            return ResponseEntity.ok(authorsService.updateAuthor(id, updateAuthor));
        }
        catch (RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hata: " + e.getMessage());
        }
    }


}
