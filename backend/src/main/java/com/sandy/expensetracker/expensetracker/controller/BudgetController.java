package com.sandy.expensetracker.expensetracker.controller;

import com.sandy.expensetracker.expensetracker.model.Budget;
import com.sandy.expensetracker.expensetracker.model.User;
import com.sandy.expensetracker.expensetracker.repository.BudgetRepository;
import com.sandy.expensetracker.expensetracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository budgetRepository,
                            UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Budget> getBudgets() {
        User user = getAuthenticatedUser();
        return budgetRepository.findByUserId(user.getId());
    }

    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    @PostMapping
    public Budget addBudget(@RequestBody Budget budget) {
        User user = getAuthenticatedUser();
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id,
                               @RequestBody Budget updated) {
        User user = getAuthenticatedUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        budget.setName(updated.getName());
        budget.setIncome(updated.getIncome());
        budget.setDate(updated.getDate());

        return budgetRepository.save(budget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        budgetRepository.delete(budget);
        return ResponseEntity.ok("Budget deleted successfully");
    }

    private User getAuthenticatedUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}