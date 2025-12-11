package org.legend8883.testproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username mustn't be empty")
    @Size(min = 3, max = 20, message = "Username must contain from 3 to 20 characters")
    private String username;

    @NotBlank(message = "Email can't be empty")
    @Email(message = "Incorrect email format")
    private String email;

    @NotBlank(message = "Password can't be empty")
    @Size(min = 6, message = "Password must contain at least 6 characters")
    private String password;

    @NotBlank(message = "Password confirmation mustn't be empty")
    private String confirmPassword;
}
