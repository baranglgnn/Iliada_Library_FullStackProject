package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Citizens;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.CitizenErrorMessages;
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
        return citizensRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(CitizenErrorMessages.CITIZEN_NOT_FOUND));
    }

    @Override
    @Transactional
    public List<Citizens> deletedCitizens() {
        return citizensRepo.findByStatusFalse();
    }

    @Override
    @Transactional
    public Citizens deleteCitizen(Long id) {
        Citizens deleteCitizen = citizensRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(CitizenErrorMessages.CITIZEN_DELETE_NOT_FOUND));
        deleteCitizen.setStatus(false);
        return citizensRepo.save(deleteCitizen);
    }

    @Override
    @Transactional
    public Citizens updateCitizen(Long id, Citizens newCitizenData) {
        return citizensRepo.findById(id)
                .map(existingCitizen -> {
                    existingCitizen.setFullName(newCitizenData.getFullName());
                    existingCitizen.setTcNo(newCitizenData.getTcNo());
                    return citizensRepo.save(existingCitizen);
                })
                .orElseThrow(() -> new NotFoundException(CitizenErrorMessages.CITIZEN_NOT_FOUND));
    }

    @Override
    @Transactional
    public Citizens addCitizen(Citizens citizen) {
        Citizens addCitizen = new Citizens(citizen.getTcNo(), citizen.getFullName(), citizen.getEmail());
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

