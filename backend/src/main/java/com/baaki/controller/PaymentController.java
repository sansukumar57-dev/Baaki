package com.baaki.controller;

import com.baaki.model.Payment;
import com.baaki.service.KhataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final KhataService khataService;

    public PaymentController(KhataService khataService) {
        this.khataService = khataService;
    }

    @GetMapping
    public List<Payment> getAll() {
        return khataService.getAllPayments();
    }

    @PostMapping
    public Payment recordPayment(@RequestBody Payment payment) {
        return khataService.recordPayment(payment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable String id) {
        khataService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
