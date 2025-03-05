package com.demo.rbac.controller;

import com.demo.rbac.OAuthRelated.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserProfileController {

    @GetMapping("/getUserProfile")
    public ResponseEntity<Map<String, String>> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract email from authenticated user
        System.out.println("we are entering user profile controller");
        String email = userDetails.getUsername(); // Assuming getUsername() returns email

        // Create a response map
        Map<String, String> response = new HashMap<>();
        response.put("email", email);

        return ResponseEntity.ok(response);

    }
}

