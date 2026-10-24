package com.baaki.model;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    private String id; // e.g. P-1048

    @Column(nullable = false)
    private String customer;

    private String date;
    private String due;
    private Double amount;
    private Double paid;

    @Column(length = 2000)
    private String items;

    private String status; // Sent, Overdue, Paid, Disputed
    private String phone;
    private Integer risk;

    public Invoice() {}

    public Invoice(String id, String customer, String date, String due, Double amount, Double paid, String items, String status, String phone, Integer risk) {
        this.id = id;
        this.customer = customer;
        this.date = date;
        this.due = due;
        this.amount = amount;
        this.paid = paid;
        this.items = items;
        this.status = status;
        this.phone = phone;
        this.risk = risk;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDue() { return due; }
    public void setDue(String due) { this.due = due; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getPaid() { return paid; }
    public void setPaid(Double paid) { this.paid = paid; }

    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getRisk() { return risk; }
    public void setRisk(Integer risk) { this.risk = risk; }
}
