package org.glgnn.kutuphane_yonetim_sistemi.Services;

import org.glgnn.kutuphane_yonetim_sistemi.Entities.Library_author;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Librarys;

import java.util.List;

public interface Library_authorService {
    List<Library_author> getAuthorsByLibraryId(Long libraryId);
    List<Librarys> getLibrariesByAuthorId(Long authorId);
    List<Library_author> getAllLibraryAuthors();
}
