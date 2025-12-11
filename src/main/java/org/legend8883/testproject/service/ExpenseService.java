package org.legend8883.testproject.service;

import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.dto.ExpenseRequest;
import org.legend8883.testproject.dto.ExpenseResponse;
import org.legend8883.testproject.dto.ExpenseStats;
import org.legend8883.testproject.entity.Category;
import org.legend8883.testproject.entity.Expense;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.repository.CategoryRepository;
import org.legend8883.testproject.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {
    private static final Logger log = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseResponse createExpense(User user, ExpenseRequest request) {

        log.debug("Creating expense for user {}: sum = {}, category = {}",
                user.getUsername(), request.getAmount(), request.getCategoryId());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> {
                    log.error("Category with ID {} not found", request.getCategoryId());
                    return new RuntimeException("Category was not found");
                });

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setCategory(category);
        expense.setUser(user);
        expense.setDate(request.getDate());
        expense.setPlace(request.getPlace().trim());

        if (request.getDescription() != null) {
            String trimmedDescription = request.getDescription().trim();
            if (!trimmedDescription.isEmpty()) {
                expense.setDescription(trimmedDescription);
            }
        }

        Expense savedExpense = expenseRepository.save(expense);

        log.info("Expanse created: ID = {}, user = {}, sum = {}, category = {}",
                expense.getId(), user.getUsername(), request.getAmount(), category.getName());

        return convertToResponse(savedExpense);
    }

    public List<ExpenseResponse> getUserExpenses(User user) {
        log.debug("Getting all expenses for the user {}", user.getUsername());

        List<Expense> expenses = expenseRepository.findByUser(user);
        List<ExpenseResponse> responses = expenses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        log.info("Found {} expanses for user {}", responses.size(), user.getUsername());

        return responses;
    }

    public ExpenseResponse getExpenseById(User user, Long expenseId) {
        log.debug("Getting expense ID = {} for user {}", expenseId, user.getUsername());

        Expense expense = findExpenseWithAccessCheck(user, expenseId);
        return convertToResponse(expense);
    }

    public ExpenseResponse updateExpense(User user, Long expenseId, ExpenseRequest request) {
        log.debug("Updating expense ID = {} for user {}", expenseId, user.getUsername());

        Expense expense = findExpenseWithAccessCheck(user, expenseId);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> {
                    log.error("Category with ID {} was not found during the update", request.getCategoryId());
                    return new RuntimeException("Category was not found");
                });

        log.info("Updating expense ID = {}: sum {} -> {}, category {} -> {}, place {} -> {}",
                expenseId,
                expense.getAmount(), request.getAmount(),
                expense.getCategory().getName(), category.getName(),
                expense.getPlace(), request.getPlace());

        expense.setAmount(request.getAmount());
        expense.setCategory(category);
        expense.setDate(request.getDate());
        expense.setPlace(request.getPlace().trim());

        if (request.getDescription() != null) {
            String trimmedDescription = request.getDescription().trim();
            if (!trimmedDescription.isEmpty()) {
                expense.setDescription(trimmedDescription);
            } else {
                expense.setDescription(null);
            }
        } else {
            expense.setDescription(null);
        }

        Expense updatedExpense = expenseRepository.save(expense);

        log.info("Expense ID = {} successfully updated", expenseId);
        return convertToResponse(updatedExpense);
    }

    public void deleteExpense(User user, Long expenseId) {
        log.debug("Deleting expense ID = {} for user {}", expenseId, user.getUsername());

        Expense expense = findExpenseWithAccessCheck(user, expenseId);
        expenseRepository.delete(expense);

        log.info("Expense ID = {} was successfully deleted by user {}", expenseId, user.getUsername());
    }

    public List<ExpenseResponse> getExpensesByCategory(User user, Long categoryId) {
        log.debug("Getting expenses by category ID = {} for user {}", categoryId, user.getUsername());

        List<Expense> expenses = expenseRepository.findByUserAndCategoryId(user, categoryId);
        List<ExpenseResponse> responses = expenses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        log.debug("Found {} expenses by category ID = {}", responses.size(), categoryId);

        return responses;
    }

    public List<ExpenseResponse> searchExpensesByPlace(User user, String place) {
        log.debug("Getting expenses by place '{}' for user {}", place, user.getUsername());

        List<Expense> expenses = expenseRepository.findByUserAndPlaceContainingIgnoreCase(user, place);
        List<ExpenseResponse> responses = expenses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        log.debug("Found {} expenses by place '{}'", responses.size(), place);

        return responses;
    }

    public List<ExpenseResponse> getExpensesByPeriod(User user, LocalDateTime start, LocalDateTime end) {
        log.debug("Getting expenses by period {} - {} for user {}",
                start, end, user.getUsername());

        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, start, end);
        List<ExpenseResponse> responses = expenses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        log.debug("Found {} expenses by period {} - {}",
                responses.size(), start, end);

        return responses;
    }

    public ExpenseStats getUserStats(User user) {
        log.debug("Calculating statistic for user {}", user.getUsername());

        ExpenseStats stats = new ExpenseStats();

        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        stats.setToday(getTotalByPeriod(user, startOfDay, endOfDay));

        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);
        stats.setWeek(getTotalByPeriod(user, startOfWeek, LocalDateTime.now()));

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        stats.setMonth(getTotalByPeriod(user, startOfMonth, LocalDateTime.now()));

        LocalDateTime startOfYear = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        stats.setYear(getTotalByPeriod(user, startOfYear, LocalDateTime.now()));

        Double total = expenseRepository.getTotalExpensesByUserAndPeriod(
                user,
                LocalDateTime.of(2000, 1, 1, 0, 0, 0),
                LocalDateTime.now());
        stats.setTotal(total != null ? total : 0.0);

        log.info("Statistic for user {}: " +
                "Today = {}, " +
                "Week = {}, " +
                "Month = {}, " +
                "Year = {}, " +
                "Total = {}",
                user.getUsername(),
                stats.getToday(),
                stats.getWeek(),
                stats.getMonth(),
                stats.getYear(),
                stats.getTotal());

        return stats;
    }

    private Expense findExpenseWithAccessCheck(User user, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> {
                    log.error("Expense with ID {} was not found", expenseId);
                    return new RuntimeException("Expense was not found");
                });

        if(!expense.getUser().getId().equals(user.getId())) {
            log.warn("Trying to access someone else's expense: user = {}, owner expense = {}",
                    user.getUsername(), expense.getUser().getUsername());
            throw new RuntimeException("Access is denied: this expense does not belong to you");
        }

        return expense;
    }

    private Double getTotalByPeriod(User user, LocalDateTime start, LocalDateTime end) {
        Double total = expenseRepository.getTotalExpensesByUserAndPeriod(user, start, end);
        return total != null ? total : 0.0;
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setAmount(expense.getAmount());
        response.setDescription(expense.getDescription());
        response.setDate(expense.getDate());
        response.setPlace(expense.getPlace());
        response.setCreatedAt(expense.getCreatedAt());

        if(expense.getCategory() != null) {
            response.setCategoryName(expense.getCategory().getName());
            response.setCategoryIcon(expense.getCategory().getIcon());
            response.setCategoryColor(expense.getCategory().getColor());
        }

        return response;
    }
}
