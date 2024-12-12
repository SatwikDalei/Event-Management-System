package com.eventmanagement.system.controller;

import com.eventmanagement.system.dto.UserResponse;
import com.eventmanagement.system.exception.ConflictException;
import com.eventmanagement.system.model.User;
import com.eventmanagement.system.repository.UserRepository;
import com.eventmanagement.system.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5500")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        // Handle validation errors
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(Map.of("message", String.join(", ", errorMessages)));
        }

        // Check if the user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "User already exists. Please login."));
        }

        // Encode the user's password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign roles
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Default role when no role is selected
            user.addRole("ROLE_USER");
        } else {
            // Handle roles passed from the frontend
            String role = user.getRoles().get(0).toUpperCase(); // Normalize to uppercase
            if ("USER".equals(role)) {
                user.addRole("ROLE_USER");
            } else if ("ATTENDEE".equals(role)) {
                user.addRole("ROLE_ATTENDEE");
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid role provided. Allowed roles are USER or ATTENDEE."));
            }
        }

        // Save the user to the database
        User savedUser = userRepository.save(user);

        // Generate JWT token for the registered user
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRoles());

        // Create a response object with user details and token
        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                token  // Send token as part of the response
        );

        // Return success response with user details and token
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User registered successfully.",
                "user", response
        ));
    }





    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials."));
        }

        // Extract roles from the existing user
        List<String> roles = existingUser.getRoles();

        // Generate JWT token including roles
        String token = jwtUtil.generateToken(existingUser.getEmail(), roles);

        // Return the token, roles, and user info
        return ResponseEntity.ok(Map.of(
                "token", token,
                "roles", roles, // Include roles in the response
                "user", new UserResponse(existingUser.getId(), existingUser.getName(), existingUser.getEmail(), token)
        ));
    }


}
