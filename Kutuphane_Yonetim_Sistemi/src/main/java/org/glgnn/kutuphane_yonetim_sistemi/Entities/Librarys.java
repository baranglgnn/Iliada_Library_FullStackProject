package org.glgnn.kutuphane_yonetim_sistemi.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "libraries")
public class Librarys {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Library_book> libraryBooks = new ArrayList<>();

    @OneToMany
    private List<Library_author> libraryAuthors = new ArrayList<>();

    public Librarys(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public Librarys() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public List<Library_book> getLibraryBooks() {
        return libraryBooks;
    }

    public void setLibraryBooks(List<Library_book> libraryBooks) {
        this.libraryBooks = libraryBooks;
    }

    public List<Library_author> getLibraryAuthors() {
        return libraryAuthors;
    }

    public void setLibraryAuthors(List<Library_author> libraryAuthors) {
        this.libraryAuthors = libraryAuthors;
    }
}
