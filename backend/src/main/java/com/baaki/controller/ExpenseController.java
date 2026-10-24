package com.baaki.controller;

import com.baaki.model.Expense;
import com.baaki.service.KhataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final KhataService khataService;

    public ExpenseController(KhataService khataService) {
        this.khataService = khataService;
    }

    @GetMapping
    public List<Expense> getAll() {
        return khataService.getAllExpenses();
    }

    @PostMapping
    public Expense create(@RequestBody Expense expense) {
        return khataService.createExpense(expense);
    }

    @PutMapping("/{id}/settle")
    public Expense settle(@PathVariable Long id) {
        return khataService.settleExpense(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        khataService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
