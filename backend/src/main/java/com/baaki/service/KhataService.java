package com.baaki.service;

import com.baaki.model.*;
import com.baaki.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhataService {

    private final CustomerRepository customerRepo;
    private final InvoiceRepository invoiceRepo;
    private final PaymentRepository paymentRepo;
    private final ExpenseRepository expenseRepo;
    private final ShopSettingsRepository settingsRepo;

    public KhataService(CustomerRepository customerRepo, InvoiceRepository invoiceRepo,
                        PaymentRepository paymentRepo, ExpenseRepository expenseRepo,
                        ShopSettingsRepository settingsRepo) {
        this.customerRepo = customerRepo;
        this.invoiceRepo = invoiceRepo;
        this.paymentRepo = paymentRepo;
        this.expenseRepo = expenseRepo;
        this.settingsRepo = settingsRepo;
    }

    @PostConstruct
    @Transactional
    public void initDemoData() {
        if (settingsRepo.count() == 0) {
            settingsRepo.save(new ShopSettings(
                    1L,
                    "Mehta Kirana & General Store",
                    "मेहता किराना एवं जनरल स्टोर",
                    "Rajesh Bhai Mehta",
                    "Kirana, FMCG, Dairy & Daily Needs",
                    "Shop #4, Gandhi Chowk, Station Road",
                    "919876543210",
                    "mehtakirana@okhdfcbank",
                    6800.0,
                    5000.0,
                    3000.0
            ));
        }

        if (customerRepo.count() == 0) {
            customerRepo.save(new Customer("Ramesh Sharma", "Ramesh ji", "919876543210", "Civil Lines, Gali 4", 4000.0, 88, 4, 85, "Regular monthly ration buyer"));
            customerRepo.save(new Customer("Pooja Verma", "Pooja ji", "919876543211", "Shanti Nagar, Flat 201", 2500.0, 94, 2, 92, "Pays by UPI promptly"));
            customerRepo.save(new Customer("Suresh Halwai", "Suresh bhai", "919876543212", "Main Chowk, Halwai Gali", 10000.0, 78, 8, 75, "Bulk buyer: Sugar, Maida, Vanaspati"));
            customerRepo.save(new Customer("Amit Tiwari", "Amit", "919876543213", "Near Primary School", 3000.0, 52, 24, 48, "Needs polite WhatsApp nudge"));
            customerRepo.save(new Customer("Sunita Devi", "Sunita ji", "919876543214", "Bapu Nagar, Gali 2", 2000.0, 96, 1, 96, "School teacher, pays 1st of month"));
            customerRepo.save(new Customer("Deepak Chai Corner", "Deepak", "919876543215", "Auto Stand, Tea Point", 5000.0, 82, 6, 80, "Daily milk, sugar & tea credit"));
        }

        if (invoiceRepo.count() == 0) {
            invoiceRepo.save(new Invoice("P-1048", "Ramesh Sharma", "2026-10-10", "2026-10-18", 1450.0, 0.0, "5kg Sharbati Atta, 1L Mustard Oil, 1kg Tata Salt, Soap", "Overdue", "919876543210", 65));
            invoiceRepo.save(new Invoice("P-1047", "Pooja Verma", "2026-10-18", "2026-10-25", 820.0, 300.0, "2 pkt Amul Gold, Britannia Bread, 500g Ghee, Ragi Cookies", "Sent", "919876543211", 25));
            invoiceRepo.save(new Invoice("P-1046", "Suresh Halwai", "2026-10-12", "2026-10-20", 4800.0, 2000.0, "50kg Sugar Bag, 1 Tin Dalda Vanaspati, Elaichi 100g", "Overdue", "919876543212", 42));
            invoiceRepo.save(new Invoice("P-1045", "Amit Tiwari", "2026-09-28", "2026-10-05", 2150.0, 0.0, "Surf Excel 2kg, Basmati Rice 5kg, Spices, Dry Fruits", "Overdue", "919876543213", 88));
            invoiceRepo.save(new Invoice("P-1044", "Sunita Devi", "2026-10-22", "2026-10-29", 650.0, 0.0, "Pooja Agarbatti, Dhoop, Camphor, Mustard Oil 500ml", "Sent", "919876543214", 15));
            invoiceRepo.save(new Invoice("P-1043", "Deepak Chai Corner", "2026-10-15", "2026-10-22", 3200.0, 1500.0, "12 Pkt Milk, 2kg Wagh Bakri Tea, Parle-G 20pkts", "Overdue", "919876543215", 45));
            invoiceRepo.save(new Invoice("P-1042", "Ramesh Sharma", "2026-09-20", "2026-09-30", 1200.0, 1200.0, "Previous Month Ration Settled", "Paid", "919876543210", 10));
        }

        if (paymentRepo.count() == 0) {
            paymentRepo.save(new Payment("REC-501", "P-1047", "Pooja Verma", 300.0, "UPI", "2026-10-24", "09:15 AM"));
            paymentRepo.save(new Payment("REC-500", "P-1046", "Suresh Halwai", 2000.0, "Cash", "2026-10-23", "07:30 PM"));
            paymentRepo.save(new Payment("REC-499", "P-1043", "Deepak Chai Corner", 1500.0, "UPI", "2026-10-22", "11:45 AM"));
            paymentRepo.save(new Payment("REC-498", "P-1042", "Ramesh Sharma", 1200.0, "Cash", "2026-10-01", "06:10 PM"));
        }

        if (expenseRepo.count() == 0) {
            expenseRepo.save(new Expense("अमूल दूध दैनिक एजेंसी (Amul Milk Delivery)", 3800.0, "2026-10-26", "Weekly", false));
            expenseRepo.save(new Expense("मंडी अनाज व तेल सप्लायर (Mandi Wholesale Agency)", 14500.0, "2026-10-29", "Bi-weekly", false));
            expenseRepo.save(new Expense("दुकान का किराया (Shop Rent - Gandhi Chowk)", 12000.0, "2026-11-01", "Monthly", false));
            expenseRepo.save(new Expense("दुकान बिजली बिल (Electricity Commercial Bill)", 2400.0, "2026-11-05", "Monthly", false));
            expenseRepo.save(new Expense("हेल्पर छोटू पगार (Shop Assistant Chhotu Salary)", 7500.0, "2026-11-02", "Monthly", false));
        }
    }

    // ========== INVOICE CRUD ==========
    public List<Invoice> getAllInvoices() {
        return invoiceRepo.findAll();
    }

    public Optional<Invoice> getInvoice(String id) {
        return invoiceRepo.findById(id);
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getId() == null || invoice.getId().trim().isEmpty()) {
            invoice.setId("P-" + (1050 + invoiceRepo.count()));
        }
        if (invoice.getPaid() == null) invoice.setPaid(0.0);
        if (invoice.getStatus() == null) invoice.setStatus("Sent");
        return invoiceRepo.save(invoice);
    }

    @Transactional
    public Invoice updateInvoice(String id, Invoice update) {
        return invoiceRepo.findById(id).map(existing -> {
            if (update.getCustomer() != null) existing.setCustomer(update.getCustomer());
            if (update.getAmount() != null) existing.setAmount(update.getAmount());
            if (update.getItems() != null) existing.setItems(update.getItems());
            if (update.getDate() != null) existing.setDate(update.getDate());
            if (update.getDue() != null) existing.setDue(update.getDue());
            if (update.getPhone() != null) existing.setPhone(update.getPhone());
            if (existing.getPaid() != null && existing.getAmount() != null) {
                if (existing.getPaid() >= existing.getAmount()) {
                    existing.setStatus("Paid");
                }
            }
            return invoiceRepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Invoice not found: " + id));
    }

    @Transactional
    public void deleteInvoice(String id) {
        invoiceRepo.deleteById(id);
    }

    // ========== PAYMENT CRUD ==========
    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    @Transactional
    public Payment recordPayment(Payment payment) {
        if (payment.getId() == null || payment.getId().trim().isEmpty()) {
            payment.setId("REC-" + (500 + paymentRepo.count() + 1));
        }

        // Update corresponding invoice
        if (payment.getInvoiceId() != null) {
            invoiceRepo.findById(payment.getInvoiceId()).ifPresent(inv -> {
                double currentPaid = inv.getPaid() != null ? inv.getPaid() : 0.0;
                double newPaid = currentPaid + payment.getAmount();
                inv.setPaid(newPaid);
                if (newPaid >= inv.getAmount()) {
                    inv.setStatus("Paid");
                }
                invoiceRepo.save(inv);
            });
        }

        // Update Galla if Cash
        if (payment.getMode() != null && payment.getMode().toLowerCase().contains("cash")) {
            settingsRepo.findById(1L).ifPresent(s -> {
                double currentGalla = s.getGalla() != null ? s.getGalla() : 0.0;
                s.setGalla(currentGalla + payment.getAmount());
                settingsRepo.save(s);
            });
        }

        return paymentRepo.save(payment);
    }

    @Transactional
    public void deletePayment(String paymentId) {
        paymentRepo.findById(paymentId).ifPresent(pay -> {
            // Revert invoice paid amount
            if (pay.getInvoiceId() != null) {
                invoiceRepo.findById(pay.getInvoiceId()).ifPresent(inv -> {
                    double currentPaid = inv.getPaid() != null ? inv.getPaid() : 0.0;
                    double revPaid = Math.max(0.0, currentPaid - pay.getAmount());
                    inv.setPaid(revPaid);
                    if (revPaid < inv.getAmount()) {
                        inv.setStatus("Sent");
                    }
                    invoiceRepo.save(inv);
                });
            }

            // Revert Galla if Cash
            if (pay.getMode() != null && pay.getMode().toLowerCase().contains("cash")) {
                settingsRepo.findById(1L).ifPresent(s -> {
                    double currentGalla = s.getGalla() != null ? s.getGalla() : 0.0;
                    s.setGalla(Math.max(0.0, currentGalla - pay.getAmount()));
                    settingsRepo.save(s);
                });
            }

            paymentRepo.deleteById(paymentId);
        });
    }

    // ========== CUSTOMER CRUD ==========
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        return customerRepo.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer update) {
        return customerRepo.findById(id).map(existing -> {
            String oldName = existing.getName();
            String newName = update.getName();

            existing.setName(newName);
            existing.setContact(update.getContact() != null ? update.getContact() : newName.split(" ")[0]);
            existing.setPhone(update.getPhone());
            existing.setArea(update.getArea());
            existing.setCreditLimit(update.getCreditLimit());
            existing.setNotes(update.getNotes());

            // If name changed, propagate to invoices and payments
            if (newName != null && !newName.equals(oldName)) {
                List<Invoice> custInvs = invoiceRepo.findByCustomer(oldName);
                for (Invoice inv : custInvs) {
                    inv.setCustomer(newName);
                    if (update.getPhone() != null) inv.setPhone(update.getPhone());
                    invoiceRepo.save(inv);
                }
                List<Payment> custPays = paymentRepo.findByCustomer(oldName);
                for (Payment p : custPays) {
                    p.setCustomer(newName);
                    paymentRepo.save(p);
                }
            }

            return customerRepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    @Transactional
    public void deleteCustomer(Long id) {
        customerRepo.deleteById(id);
    }

    // ========== EXPENSE (DISTRIBUTOR BILLS) CRUD ==========
    public List<Expense> getAllExpenses() {
        return expenseRepo.findAll();
    }

    @Transactional
    public Expense createExpense(Expense expense) {
        if (expense.getIsPaid() == null) expense.setIsPaid(false);
        return expenseRepo.save(expense);
    }

    @Transactional
    public Expense settleExpense(Long id) {
        return expenseRepo.findById(id).map(exp -> {
            exp.setIsPaid(true);

            // Deduct from Galla
            settingsRepo.findById(1L).ifPresent(s -> {
                double currentGalla = s.getGalla() != null ? s.getGalla() : 0.0;
                s.setGalla(Math.max(0.0, currentGalla - exp.getAmount()));
                settingsRepo.save(s);
            });

            return expenseRepo.save(exp);
        }).orElseThrow(() -> new RuntimeException("Expense not found: " + id));
    }

    @Transactional
    public void deleteExpense(Long id) {
        expenseRepo.deleteById(id);
    }

    // ========== SETTINGS ==========
    public ShopSettings getSettings() {
        return settingsRepo.findById(1L).orElseGet(() -> settingsRepo.save(new ShopSettings(
                1L, "Mehta Kirana & General Store", "मेहता किराना एवं जनरल स्टोर",
                "Rajesh Bhai Mehta", "Kirana & Retail", "Gandhi Chowk", "919876543210",
                "mehtakirana@okhdfcbank", 6800.0, 5000.0, 3000.0
        )));
    }

    @Transactional
    public ShopSettings updateSettings(ShopSettings update) {
        update.setId(1L);
        return settingsRepo.save(update);
    }

    // ========== RESET DEMO ==========
    @Transactional
    public void resetAll() {
        paymentRepo.deleteAll();
        invoiceRepo.deleteAll();
        customerRepo.deleteAll();
        expenseRepo.deleteAll();
        settingsRepo.deleteAll();
        initDemoData();
    }
}
