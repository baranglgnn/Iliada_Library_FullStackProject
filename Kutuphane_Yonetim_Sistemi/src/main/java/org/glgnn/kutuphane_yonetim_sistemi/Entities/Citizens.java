package org.glgnn.kutuphane_yonetim_sistemi.Entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "citizen")
public class Citizens {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "citizen_seq")
    @SequenceGenerator(
            name = "citizen_seq",
            sequenceName = "citizen_sequence",
            allocationSize = 1
    )
    private Long id;


    @Column(name = "tc_no", nullable = false, unique = true, length = 11)
    private String tcNo;

    @Column(name = "fullname", nullable = false)
    private String fullName;

    @Column(name = "status", nullable = false)
    private boolean status = true;


    public Citizens(String tcNo, String fullName) {
        this.tcNo = tcNo;
        this.fullName = fullName;

    }
    public Citizens() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTcNo() {
        return tcNo;
    }

    public void setTcNo(String tcNo) {
        this.tcNo = tcNo;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }


}