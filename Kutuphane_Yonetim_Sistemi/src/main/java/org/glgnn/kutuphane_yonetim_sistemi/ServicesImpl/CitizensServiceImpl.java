package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.CitizensRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.CitizensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CitizensServiceImpl implements CitizensService {
    public final CitizensRepository citizensRepo;

    @Autowired
    public CitizensServiceImpl(CitizensRepository citizensRepo) {
        this.citizensRepo = citizensRepo;
    }

    @Override
    @Transactional
    public Page<Citizens> getAllActiveCitizens(Pageable pageable) {
        return citizensRepo.findByStatusTrue(pageable);
    }

    @Override
    @Transactional
    public Citizens findCitizenById(Long id) {
        return citizensRepo.findById(id).get();
    }

    @Override
    @Transactional
    public List<Citizens> deletedCitizens() {
        return citizensRepo.findByStatusFalse();
    }

    @Override
    @Transactional
    public Citizens deleteCitizen(Long id) {
        if (citizensRepo.findById(id).isEmpty()) {
            throw new RuntimeException("Silinecek vatandas bulunamadı!");
        }
        Citizens deleteCitizen = citizensRepo.findById(id).get();
        deleteCitizen.setStatus(false);
        return citizensRepo.save(deleteCitizen);
    }

    @Transactional
    public Citizens updateCitizen(Long id, Citizens newCitizenData) {
        return citizensRepo.findById(id)
                .map(existingCitizen -> {
                    existingCitizen.setFullName(newCitizenData.getFullName());
                    return citizensRepo.save(existingCitizen);
                })
                .orElseThrow(() -> new RuntimeException("VatandaS bulunamadİ!"));
    }

    @Override
    @Transactional
    public Citizens addCitizen(Citizens citizen) {
        Citizens addCitizen = new Citizens(citizen.getTcNo(), citizen.getFullName());
        return citizensRepo.save(addCitizen);
    }
    @Override
    public Long getCitizenIdByTc(String tc) {
        Citizens citizen = citizensRepo.findByTcNo(tc);
        if (citizen == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TC numarasına ait vatandaş bulunamadı.");
        }
        return citizen.getId();
    }

    @Override
    public List<Citizens> getCitizensByName(String keyword) {
        return citizensRepo.findByfullNameStartingWith(keyword);
    }

}

