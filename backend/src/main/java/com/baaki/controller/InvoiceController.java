package com.baaki.controller;

import com.baaki.model.Invoice;
import com.baaki.service.KhataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final KhataService khataService;

    public InvoiceController(KhataService khataService) {
        this.khataService = khataService;
    }

    @GetMapping
    public List<Invoice> getAll() {
        return khataService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(@PathVariable String id) {
        return khataService.getInvoice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Invoice create(@RequestBody Invoice invoice) {
        return khataService.createInvoice(invoice);
    }

    @PutMapping("/{id}")
    public Invoice update(@PathVariable String id, @RequestBody Invoice invoice) {
        return khataService.updateInvoice(id, invoice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        khataService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
