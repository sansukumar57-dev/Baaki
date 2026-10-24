package com.baaki.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    private String id; // e.g. REC-501

    private String invoiceId;
    private String customer;
    private Double amount;
    private String mode; // Cash, UPI, Bank
    private String date;
    private String time;

    public Payment() {}

    public Payment(String id, String invoiceId, String customer, Double amount, String mode, String date, String time) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.customer = customer;
        this.amount = amount;
        this.mode = mode;
        this.date = date;
        this.time = time;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
