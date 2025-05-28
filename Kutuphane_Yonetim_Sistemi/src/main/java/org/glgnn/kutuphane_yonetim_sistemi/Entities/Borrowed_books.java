package org.glgnn.kutuphane_yonetim_sistemi.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "borrowed_book")
public class Borrowed_books {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "borrowed_book_seq")
    @SequenceGenerator(
            name = "borrowed_book_seq",
            sequenceName = "borrowed_book_sequence",
            allocationSize = 1
    )
    private Long id;


    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private Citizens citizen;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Books book;

    @ManyToOne
    @JoinColumn(name = "library_id", nullable = false)
    private Librarys library;

    @Column(name = "borrow_date", nullable = false)
    private LocalDate borrowDate = LocalDate.now();

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    public Borrowed_books(Citizens citizen, Books book, Librarys library, LocalDate borrowDate, LocalDate returnDate) {
        this.citizen = citizen;
        this.book = book;
        this.library = library;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
    }
    public Borrowed_books() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Citizens getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizens citizen) {
        this.citizen = citizen;
    }

    public Books getBook() {
        return book;
    }

    public void setBook(Books book) {
        this.book = book;
    }

    public Librarys getLibrary() {
        return library;
    }

    public void setLibrary(Librarys library) {
        this.library = library;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
