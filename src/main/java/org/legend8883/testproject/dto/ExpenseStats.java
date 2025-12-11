package org.legend8883.testproject.dto;

import lombok.Data;

@Data
public class ExpenseStats {
    private Double today;
    private Double week;
    private Double month;
    private Double year;
    private Double total;
}
