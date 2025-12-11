package org.legend8883.testproject.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExpenseResponse {
    private Long id;
    private Double amount;
    private String description;
    private LocalDateTime date;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private String place;
    private LocalDateTime createdAt;
}
