package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface CitizensService {
    Page<Citizens> getAllActiveCitizens(Pageable pageable);
    Citizens findCitizenById(Long id);
    List<Citizens> deletedCitizens();
    Citizens deleteCitizen(Long id);
    Citizens updateCitizen(Long id,Citizens citizen);
    Citizens addCitizen(Citizens citizen);
    Long getCitizenIdByTc(String tcNo);
    List<Citizens> getCitizensByName(String keyword);

}
