package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;


public interface AuthorsService {
    Authors getAuthorById(Long id);
    Page<Authors> getAllActiveAuthors(Pageable pageable);
    Page<Authors> deletedAuthors(Pageable pageable);
    Authors deleteAuthor(Long id);
    Authors saveAuthor(Authors author);
    Authors updateAuthor(Long id, Authors author);
    List<Authors> getAuthorsByName(String keyword);
    List<Books> getBooksByAuthorId(Long authorId);
    List<Librarys> getLibrariesByAuthorId(Long authorId);
}
