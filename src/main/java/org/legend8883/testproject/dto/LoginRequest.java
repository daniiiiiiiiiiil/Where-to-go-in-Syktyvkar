package org.legend8883.testproject.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username mustn't be empty")
    private String username;

    @NotBlank(message = "Password can't be empty")
    private String password;
}
