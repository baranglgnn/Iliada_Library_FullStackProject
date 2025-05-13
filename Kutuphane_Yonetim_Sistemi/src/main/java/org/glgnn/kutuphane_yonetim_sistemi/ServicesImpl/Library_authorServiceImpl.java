package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_author;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.Library_authorRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.Library_authorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Library_authorServiceImpl implements Library_authorService {

    public final Library_authorRepository library_authorRepo;

    @Autowired
    public Library_authorServiceImpl(Library_authorRepository libraryAuthorRepo) {
        library_authorRepo = libraryAuthorRepo;
    }

    @Override
    @Transactional
    public List<Library_author> getAuthorsByLibraryId(Long libraryId) {
        return library_authorRepo.findByLibraryId(libraryId);
    }

    @Override
    @Transactional
    public List<Librarys> getLibrariesByAuthorId(Long authorId) {
        return library_authorRepo.findLibrariesByAuthorId(authorId);
    }

    @Override
    public List<Library_author> getAllLibraryAuthors() {
        return library_authorRepo.findAllLibraryAuthors();
    }
}
