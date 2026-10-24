package com.baaki.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String contact;
    private String phone;
    private String area;
    private Double creditLimit;
    private Integer trustScore;
    private Integer lateDays;
    private Integer onTimeRate;

    @Column(length = 1000)
    private String notes;

    public Customer() {}

    public Customer(String name, String contact, String phone, String area, Double creditLimit, Integer trustScore, Integer lateDays, Integer onTimeRate, String notes) {
        this.name = name;
        this.contact = contact;
        this.phone = phone;
        this.area = area;
        this.creditLimit = creditLimit;
        this.trustScore = trustScore;
        this.lateDays = lateDays;
        this.onTimeRate = onTimeRate;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public Double getCreditLimit() { return creditLimit; }
    public void setCreditLimit(Double creditLimit) { this.creditLimit = creditLimit; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Integer getLateDays() { return lateDays; }
    public void setLateDays(Integer lateDays) { this.lateDays = lateDays; }

    public Integer getOnTimeRate() { return onTimeRate; }
    public void setOnTimeRate(Integer onTimeRate) { this.onTimeRate = onTimeRate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
