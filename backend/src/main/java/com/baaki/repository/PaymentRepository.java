package com.baaki.repository;

import com.baaki.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByCustomer(String customer);
    List<Payment> findByInvoiceId(String invoiceId);
}
