package org.legend8883.testproject.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExpenseRequest {
    @NotNull(message = "Sum can't be null")
    @Positive(message = "Sum must be positive")
    private Double amount;

    @Size(max = 255, message = "Description is too long")
    private String description;

    @NotNull(message = "Date can't be null")
    @PastOrPresent(message = "Date can't be in the future")
    private LocalDateTime date;

    @NotNull(message = "Category can't be null")
    private Long categoryId;

    @NotBlank(message = "Specify the location")
    private String place;
}