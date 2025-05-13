package org.glgnn.kutuphane_yonetim_sistemi.Entities;
import jakarta.persistence.*;



@Entity
@Table(name = "author")
public class Authors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullname", nullable = false)
    private String name;

    @Column(name = "status", nullable = false)
    private boolean status = true;

    public Authors(String name) {
        this.name = name;
    }

    public Authors() {}

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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

}

