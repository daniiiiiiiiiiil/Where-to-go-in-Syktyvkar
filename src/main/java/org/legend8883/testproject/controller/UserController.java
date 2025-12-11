package org.legend8883.testproject.controller;

import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.repository.UserRepository;
import org.legend8883.testproject.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@RequestBody User updatedUser) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User existingUser = (User) authentication.getPrincipal();

            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPreferredTransport(updatedUser.getPreferredTransport());
            existingUser.setInterests(updatedUser.getInterests());
            existingUser.setBudgetLimit(updatedUser.getBudgetLimit());

            User savedUser = userRepository.save(existingUser);

            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
