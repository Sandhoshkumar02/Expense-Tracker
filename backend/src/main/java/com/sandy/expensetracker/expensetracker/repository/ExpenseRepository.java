package com.sandy.expensetracker.expensetracker.repository;
import com.sandy.expensetracker.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List <Expense> findByUserId(Long userId);

}
