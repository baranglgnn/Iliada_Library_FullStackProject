package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.Services.LibrarysService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Librarys getLibrary(@PathVariable Long id)
    {
        return libService.findLibraryById(id);
    }


    @GetMapping("/deleted")
    public ResponseEntity<List<Librarys>> deletedLibraries()
    {
        return ResponseEntity.ok(libService.deletedLibraries());

    }

    @PostMapping("deleteLibrary/{id}")
        public ResponseEntity<?> deleteLibrary(@PathVariable Long id)
        {
            try{
                return ResponseEntity.ok(libService.deleteLibraryById(id));
            }catch (RuntimeException e)
            {
                return ResponseEntity.badRequest().body("Hata"+e.getMessage());
            }
        }

    @PostMapping("/saveLibrary")
    public ResponseEntity<Librarys> saveLibrary(@RequestBody Librarys library)
    {
        return ResponseEntity.ok(libService.saveLibrary(library.getName(), library.getAddress()));
    }

    @PutMapping("/updateLibrary/{id}")
    public ResponseEntity<?> updateLibrary(@PathVariable Long id , @RequestBody Librarys library)
    {
        try{
            Librarys updateLib= libService.findLibraryById(id);
            updateLib.setName(library.getName());
            updateLib.setAddress(library.getAddress());
            return ResponseEntity.ok(libService.updateLibrary(id, updateLib));
        }catch (RuntimeException e)
        {
         return  ResponseEntity.badRequest().body("Hata"+e.getMessage());
        }
    }

    @GetMapping("/searchLibrary")
    public List<Librarys> searchLibraryByName(@RequestParam("name") String keyword) {
        return libService.findAllLibrariesByName(keyword);
    }

}
