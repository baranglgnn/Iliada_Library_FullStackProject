package org.glgnn.kutuphane_yonetim_sistemi.Entities;


import jakarta.persistence.*;


@Entity
@Table(name = "library_book")
public class Library_book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "library_id", nullable = false)
    private Librarys library;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    public Library_book(Librarys library, Books book) {
        this.library = library;
        this.book = book;
    }
    public Library_book() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Librarys getLibrary() {
        return library;
    }

    public void setLibrary(Librarys library) {
        this.library = library;
    }

    public Books getBook() {
        return book;
    }

    public void setBook(Books book) {
        this.book = book;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}