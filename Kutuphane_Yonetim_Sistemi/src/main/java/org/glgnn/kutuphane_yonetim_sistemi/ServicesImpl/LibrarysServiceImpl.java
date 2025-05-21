package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.LibrarysRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.LibrarysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibrarysServiceImpl implements LibrarysService {
    public final LibrarysRepository librarysRepo;

    @Autowired
    public LibrarysServiceImpl(LibrarysRepository librarysRepo)
    {
        this.librarysRepo = librarysRepo;
    }

    @Override
    @Transactional
    public Page<Librarys> getAllActiveLibraries(Pageable pageable) {
        return librarysRepo.findByStatusTrue(pageable);
    }

    @Override
    @Transactional
    public Librarys findLibraryById(Long id) {
        return librarysRepo.findById(id).get();
    }

    @Override
    @Transactional
    public List<Librarys> deletedLibraries() {
        return librarysRepo.findByStatusFalse();
    }

    @Override
    @Transactional
    public Librarys saveLibrary(String name, String address) {
        Librarys savedLibrary = new Librarys(name,address);
        return librarysRepo.save(savedLibrary);
    }

    @Transactional
    public Librarys updateLibrary(Long id, Librarys newLibraryData) {
        return librarysRepo.findById(id)
                .map(existingLibrary -> {
                    existingLibrary.setName(newLibraryData.getName());
                    existingLibrary.setAddress(newLibraryData.getAddress());
                    return librarysRepo.save(existingLibrary);
                })
                .orElseThrow(() -> new RuntimeException("Kutuphane bulunamadi!"));
    }

    @Override
    @Transactional
    public Librarys deleteLibraryById(Long id) {
        if(librarysRepo.findById(id).isEmpty()){
            throw new RuntimeException("Silinecek kutuphane bulunamadi");
        }
        Librarys deletedLibrary = librarysRepo.findById(id).get();
        deletedLibrary.setStatus(false);
        return librarysRepo.save(deletedLibrary);
    }

    @Override
    public List<Librarys> findAllLibrariesByName(String keyword) {
        return librarysRepo.findByNameStartingWithLibrays(keyword);
    }
}
