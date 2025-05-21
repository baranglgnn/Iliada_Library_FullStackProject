package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_author;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface Library_authorService {
    List<Library_author> getAuthorsByLibraryId(Long libraryId);
    List<Librarys> getLibrariesByAuthorId(Long authorId);
    Page<Library_author> getAllLibraryAuthors(Pageable pageable);
}
