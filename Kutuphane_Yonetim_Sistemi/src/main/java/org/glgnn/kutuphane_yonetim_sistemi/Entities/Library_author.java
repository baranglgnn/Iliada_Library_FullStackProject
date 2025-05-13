package org.glgnn.kutuphane_yonetim_sistemi.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "library_authors")
public class Library_author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "library_id", nullable = false)
    private Librarys library;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Authors author;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    public Library_author(Librarys library, Authors author) {
        this.library = library;
        this.author = author;
    }
    public Library_author() {}

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

    public Authors getAuthor() {
        return author;
    }

    public void setAuthor(Authors author) {
        this.author = author;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
