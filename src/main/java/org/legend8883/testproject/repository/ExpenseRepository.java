package org.legend8883.testproject.repository;

import org.legend8883.testproject.entity.Expense;
import org.legend8883.testproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByUserAndCategoryId(User user, Long categoryId);
    List<Expense> findByUserAndDateBetween(User user, LocalDateTime start, LocalDateTime end);
    List<Expense> findByUserAndPlaceContainingIgnoreCase(User user, String place);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end")
    Double getTotalExpensesByUserAndPeriod(@Param("user") User user,
                                           @Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);
}
