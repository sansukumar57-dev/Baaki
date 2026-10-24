package com.baaki.controller;

import com.baaki.model.Customer;
import com.baaki.service.KhataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final KhataService khataService;

    public CustomerController(KhataService khataService) {
        this.khataService = khataService;
    }

    @GetMapping
    public List<Customer> getAll() {
        return khataService.getAllCustomers();
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return khataService.createCustomer(customer);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        return khataService.updateCustomer(id, customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        khataService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
