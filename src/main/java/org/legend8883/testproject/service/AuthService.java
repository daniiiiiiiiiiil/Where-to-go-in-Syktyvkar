package org.legend8883.testproject.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.dto.LoginRequest;
import org.legend8883.testproject.dto.RegisterRequest;
import org.legend8883.testproject.entity.Role;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.repository.UserRepository;
import org.legend8883.testproject.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User with that name already exist");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exist");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);

        return "User was successfully created";
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User was not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
    }

    @PostConstruct
    public void createAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@mail.ru");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin created");
        }
    }
}
