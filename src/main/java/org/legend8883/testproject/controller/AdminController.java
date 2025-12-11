package org.legend8883.testproject.controller;

import lombok.RequiredArgsConstructor;
import org.legend8883.testproject.entity.User;
import org.legend8883.testproject.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(currentUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("You can't delete yourself");
        }

        userRepository.deleteById(userId);
        return ResponseEntity.ok("User has been deleted");
    }
}
