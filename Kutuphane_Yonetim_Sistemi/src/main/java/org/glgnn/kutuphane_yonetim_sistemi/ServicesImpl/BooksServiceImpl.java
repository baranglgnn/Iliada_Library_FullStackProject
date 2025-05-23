package org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Authors;
import org.glgnn.kutuphane_yonetim_sistemi.Entities.Books;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.AuthorsRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Repositorys.BooksRepository;
import org.glgnn.kutuphane_yonetim_sistemi.Services.BooksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class BooksServiceImpl implements BooksService {
    public final BooksRepository booksRepo;
    public final AuthorsRepository authorsRepo;

    @Autowired
    public BooksServiceImpl(BooksRepository booksRepo, AuthorsRepository authorsRepo)
    {
        this.booksRepo=booksRepo;
        this.authorsRepo = authorsRepo;
    }

    @Override
    @Transactional
    public Page<Books> getAllActiveBooks(Pageable pageable) {
        return booksRepo.findByStatusTrue(pageable);
    }

    @Override
    @Transactional
    public Books findBookById(Long id) {
        return booksRepo.findById(id).get();
    }

    @Override
    @Transactional
    public List<Books> deletedBooks() {
        return booksRepo.findByStatusFalse();
    }

    @Override
    @Transactional
    public List<Books> getAllBooksSorted()
    {
        return booksRepo.findAllByOrderByTitleAsc();
    }

    @Override
    public List<Books> getBooksByAuthor(Long authorId) {
        return List.of();
    }

    @Override
    public List<Books> GetBooksByAuthor(Long authorId) {
        return booksRepo.findByAuthorId(authorId);
    }

    @Override
    public List<Books> findBooksByTitlePrefix(String keyword) {
        return booksRepo.findByTitleStartingWith(keyword);
    }


    @Override
    @Transactional
    public Books updateBook(Long id, Books newBookData) {
        return booksRepo.findById(id)
                .map(existingBook -> {
                    existingBook.setTitle(newBookData.getTitle());
                    existingBook.setAuthor(newBookData.getAuthor());
                    return booksRepo.save(existingBook);
                })
                .orElseThrow(() -> new RuntimeException("Kitap bulunamadı!"));
    }



    @Override
    @Transactional
    public Books addBook(String title,Long authorId)
    {
        Authors authorTmp = authorsRepo.findById(authorId)
                .orElseThrow(()-> new EntityNotFoundException("Author id " + authorId + " Buulunamadi!"));

         Books newBook = new Books(title,authorTmp);
         return booksRepo.save(newBook);
    }


    @Override
    @Transactional
    public Books deleteBook(Long id) {
        if(booksRepo.findById(id).isEmpty())
        {
            throw new RuntimeException("silinecek kitap bulunamadi!");
        }
        Books deleteBook = booksRepo.findById(id).get();
        deleteBook.setStatus(false);
        return booksRepo.save(deleteBook);
    }
}
