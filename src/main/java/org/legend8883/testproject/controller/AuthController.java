package org.legend8883.testproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.dto.LoginRequest;
import org.legend8883.testproject.dto.RegisterRequest;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.repository.UserRepository;
import org.legend8883.testproject.security.JwtUtil;
import org.legend8883.testproject.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String result = authService.register(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        try {
            String result = authService.login(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}