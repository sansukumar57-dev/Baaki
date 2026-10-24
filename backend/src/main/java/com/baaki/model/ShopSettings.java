package com.baaki.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shop_settings")
public class ShopSettings {

    @Id
    private Long id = 1L;

    private String name;
    private String nameHi;
    private String owner;
    private String category;
    private String address;
    private String phone;
    private String upi;
    private Double galla;
    private Double buffer;
    private Double defaultLimit;

    public ShopSettings() {}

    public ShopSettings(Long id, String name, String nameHi, String owner, String category, String address, String phone, String upi, Double galla, Double buffer, Double defaultLimit) {
        this.id = id;
        this.name = name;
        this.nameHi = nameHi;
        this.owner = owner;
        this.category = category;
        this.address = address;
        this.phone = phone;
        this.upi = upi;
        this.galla = galla;
        this.buffer = buffer;
        this.defaultLimit = defaultLimit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameHi() { return nameHi; }
    public void setNameHi(String nameHi) { this.nameHi = nameHi; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getUpi() { return upi; }
    public void setUpi(String upi) { this.upi = upi; }

    public Double getGalla() { return galla; }
    public void setGalla(Double galla) { this.galla = galla; }

    public Double getBuffer() { return buffer; }
    public void setBuffer(Double buffer) { this.buffer = buffer; }

    public Double getDefaultLimit() { return defaultLimit; }
    public void setDefaultLimit(Double defaultLimit) { this.defaultLimit = defaultLimit; }
}
