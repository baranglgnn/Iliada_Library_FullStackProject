package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;


import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.NotFoundException;
import org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages.messages.AuthorErrorMessages;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.AuthorsRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        return authorRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(AuthorErrorMessages.AUTHOR_NOT_FOUND));
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
        Authors deleteAuthor = authorRepo.findById(id)
                .orElseThrow(() -> new NotFoundException(AuthorErrorMessages.AUTHOR_NOT_FOUND));
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

    @Override
    public List<Books> getBooksByAuthorId(Long authorId) {
        return List.of();
    }

    @Override
    @Transactional
    public List<Librarys> getLibrariesByAuthorId(Long authorId) {
        Authors author = authorRepo.findById(authorId)
                .orElseThrow(() -> new NotFoundException(AuthorErrorMessages.AUTHOR_NOT_FOUND));
        return author.getLibraries().stream()
                .filter(Librarys::isStatus)
                .collect(Collectors.toList());
    }
}
