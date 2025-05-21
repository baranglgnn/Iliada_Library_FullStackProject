package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface LibrarysService {
    Page<Librarys> getAllActiveLibraries(Pageable pageable);
    Librarys findLibraryById(Long id);
    List<Librarys> deletedLibraries();
    Librarys saveLibrary(String name, String address);
    Librarys updateLibrary(Long id,Librarys library);
    Librarys deleteLibraryById(Long id);
    List<Librarys> findAllLibrariesByName(String keyword);
}
