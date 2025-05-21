package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;


import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.AuthorsRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorsServiceImpl implements AuthorsService {
    public final AuthorsRepository authorRepo;

    @Autowired
    public AuthorsServiceImpl(AuthorsRepository authorRepo) {
        this.authorRepo = authorRepo;
    }


    @Override
    @Transactional
    public Authors getAuthorById(Long id) {
        return authorRepo.findById(id).get();
    }

    @Override
    @Transactional
    public Page<Authors> getAllActiveAuthors(Pageable pageable) {
        return authorRepo.findByStatusTrue(pageable);
    }

    @Override
    @Transactional
    public Page<Authors> deletedAuthors(Pageable pageable) {
        return authorRepo.findByStatusFalse(pageable);
    }

    @Override
    @Transactional
    public Authors deleteAuthor(Long id) {
        if(authorRepo.findById(id).isEmpty())
        {
         throw new RuntimeException("Yazar bulunamadı!");
        }
        Authors deleteAuthor = authorRepo.findById(id).get();
        deleteAuthor.setStatus(false);
        return authorRepo.save(deleteAuthor);
    }

    @Override
    @Transactional
    public Authors saveAuthor(Authors authors) {
        Authors newAuthor = new Authors(authors.getName());
        return authorRepo.save(newAuthor);
    }

    @Override
    @Transactional
    public Authors updateAuthor(Long id, Authors authors) {
        return authorRepo.findById(id)
                .map(existingAuthor -> {
                    existingAuthor.setName(authors.getName());
                    return authorRepo.save(existingAuthor);
                })
                .orElseGet(() -> authorRepo.save(new Authors(authors.getName())));
    }

    @Override
    public List<Authors> getAuthorsByName(String keyword) {
        return authorRepo.findByNameStartingWith(keyword);
    }
}
