package org.glgnn.kutuphane_yonetim_sistemi.RestApiControllers;


import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.glgnn.kutuphane_yonetim_sistemi.Services.CitizensService;
import org.glgnn.kutuphane_yonetim_sistemi.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citizens")
public class CitizensController {
    public final CitizensService citizService;
    public final UserService userService;

    @Autowired
    public CitizensController(CitizensService citizService, UserService userService) {
        this.citizService = citizService;
        this.userService = userService;
    }

    @GetMapping("/getAllCitizens")
    public ResponseEntity<Page<Citizens>> getAllCitizens(Pageable pageable) {
        Page<Citizens> citizensPage = citizService.getAllActiveCitizens(pageable);
        return ResponseEntity.ok(citizensPage);
    }

    @GetMapping("/getCitizen/{id}")
    public Citizens getCitizen(@PathVariable("id") Long id) {
        return citizService.findCitizenById(id);
    }


    @GetMapping("/deleted")
    public ResponseEntity<List<Citizens>> deletedCitizens() {
        return ResponseEntity.ok(citizService.deletedCitizens());
    }

    @PostMapping("deleteCitzen/{id}")
    public ResponseEntity<?> deleteCitizen(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(citizService.deleteCitizen(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Hata" + e.getMessage());
        }
    }

    @PostMapping("/saveCitizen")
    public ResponseEntity<?> addCtizen(@RequestBody Citizens citizen) {
        try {
            Citizens newCitizen = new Citizens(citizen.getTcNo(), citizen.getFullName());
            return ResponseEntity.ok(citizService.addCitizen(newCitizen));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Hata" + e.getMessage());
        }
    }

    @PutMapping("/updateCitizen/{id}")
    public ResponseEntity<?> updateCitizen(@PathVariable Long id, @RequestBody Citizens citizen) {
        try {
            Citizens updateCitizen = citizService.findCitizenById(id);
            updateCitizen.setFullName(citizen.getFullName());
            updateCitizen.setTcNo(citizen.getTcNo());
            return ResponseEntity.ok(citizService.updateCitizen(id, updateCitizen));
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Hata" + e.getMessage());
        }
    }
    @GetMapping("/getIdByTc/{tc}")
    public ResponseEntity<Long> getCitizenIdByTc(@PathVariable String tc) {
        Long id = citizService.getCitizenIdByTc(tc);
        if (id == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(id);
    }

    @GetMapping("/searchCitizen")
    public List<Citizens> searchCitizenByFullname(@RequestParam("fullname") String keyword) {
        return citizService.getCitizensByName(keyword);
    }
}