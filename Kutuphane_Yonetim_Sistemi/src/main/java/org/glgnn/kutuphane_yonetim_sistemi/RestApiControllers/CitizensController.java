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

    @PostMapping("/deleteCitzen/{id}")
    public Citizens deleteCitizen(@PathVariable Long id) {
        return citizService.deleteCitizen(id);
    }

    @PostMapping("/saveCitizen")
    public Citizens addCitizen(@RequestBody Citizens citizen) {
        return citizService.addCitizen(new Citizens(citizen.getTcNo(), citizen.getFullName(), citizen.getEmail()));
    }

    @PutMapping("/updateCitizen/{id}")
    public Citizens updateCitizen(@PathVariable Long id, @RequestBody Citizens citizen) {
        citizen.setTcNo(citizen.getTcNo());
        citizen.setFullName(citizen.getFullName());
        return citizService.updateCitizen(id, citizen);
    }
    @GetMapping("/getIdByTc/{tc}")
    public ResponseEntity<Long> getCitizenIdByTc(@PathVariable String tc) {
        return ResponseEntity.ok(citizService.getCitizenIdByTc(tc));
    }

    @GetMapping("/searchCitizen")
    public List<Citizens> searchCitizenByFullname(@RequestParam("fullname") String keyword) {
        return citizService.getCitizensByName(keyword);
    }
}