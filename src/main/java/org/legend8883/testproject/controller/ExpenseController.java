package org.legend8883.testproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.legend8883.testproject.dto.ExpenseRequest;
import org.legend8883.testproject.dto.ExpenseResponse;
import org.legend8883.testproject.dto.ExpenseStats;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    private User getCurrentUser(Authentication authentication) {
        if(authentication == null) {
            throw new RuntimeException("Authentication required");
        }

        return (User) authentication.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @RequestBody @Valid ExpenseRequest request,
            Authentication authentication) {
        log.info("Creating new expense: sum = {}, category = {}, place = {}",
                request.getAmount(), request.getCategoryId(), request.getPlace());

        User currentUser = getCurrentUser(authentication);
        ExpenseResponse response = expenseService.createExpense(currentUser, request);

        log.info("Expense successfully created: ID = {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getUserExpenses(Authentication authentication) {
        log.debug("Getting all user's expenses");

        User currentUser = getCurrentUser(authentication);
        List<ExpenseResponse> expenses = expenseService.getUserExpenses(currentUser);

        log.debug("Got {} expenses", expenses.size());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(
            @PathVariable Long expenseId,
            Authentication authentication) {
        log.debug("Getting expense ID = {}", expenseId);

        User currentUser = getCurrentUser(authentication);
        ExpenseResponse expense = expenseService.getExpenseById(currentUser, expenseId);

        log.debug("Expense ID = {}", expenseId);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long expenseId,
            @RequestBody @Valid ExpenseRequest request,
            Authentication authentication) {
        log.info("Updating expense ID = {}", expenseId);

        User currentUser = getCurrentUser(authentication);
        ExpenseResponse updatedResponse = expenseService.updateExpense(currentUser, expenseId, request);

        log.info("Expense ID = {} successfully updated", expenseId);
        return ResponseEntity.ok(updatedResponse);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long expenseId,
            Authentication authentication) {
        log.info("Deleting expense ID = {}", expenseId);
        User currentUser = getCurrentUser(authentication);
        expenseService.deleteExpense(currentUser, expenseId);

        log.info("Expense ID = {} successfully deleted", expenseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<ExpenseStats> getStats(Authentication authentication) {
        log.debug("Getting statistic of expenses");

        User currentUser = getCurrentUser(authentication);
        ExpenseStats stats = expenseService.getUserStats(currentUser);

        log.debug("Statistic got: {}", stats);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExpenseResponse>> searchExpensesByPlace(
            @RequestParam String place,
            Authentication authentication) {
        log.debug("Getting expenses by place: '{}'", place);

        User currentUser = getCurrentUser(authentication);
        List<ExpenseResponse> expenses = expenseService.searchExpensesByPlace(currentUser, place);

        log.debug("Found {} expenses by place '{}'",
                expenses.size(), place);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(
            @PathVariable Long categoryId,
            Authentication authentication) {
        log.debug("Getting expenses by category ID = {}", categoryId);

        User currentUser = getCurrentUser(authentication);
        List<ExpenseResponse> expenses = expenseService.getExpensesByCategory(currentUser, categoryId);

        log.debug("Found {} expenses by category ID = {}",
                expenses.size(), categoryId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/period")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByPeriod(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            Authentication authentication) {
        log.debug("Getting expenses by period: {} - {}",
                start, end);

        User currentUser = getCurrentUser(authentication);
        List<ExpenseResponse> expenses = expenseService.getExpensesByPeriod(currentUser, start, end);

        log.debug("Found {} expenses by period {} - {}",
                expenses.size(), start, end);
        return ResponseEntity.ok(expenses);
    }
}
