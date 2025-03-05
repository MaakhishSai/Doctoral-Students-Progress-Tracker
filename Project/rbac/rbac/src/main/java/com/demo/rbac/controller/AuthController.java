package com.demo.rbac.controller;

import com.demo.rbac.model.User;
import com.demo.rbac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    // for coordinator login
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        System.out.println("am i entering here");
        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Find user in database
        Optional<User> user = userRepository.findByEmail(request.username());
        if (user.isPresent()) {
            return ResponseEntity.ok(new LoginResponse("Login successful!", user.get().getUserRole().name()));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}

// DTO for Login Request
record LoginRequest(String username, String password) {}

// DTO for Login Response
record LoginResponse(String message, String role) {}
