package com.demo.rbac.controller;

import com.demo.rbac.OAuthRelated.CustomUserDetails;
import com.demo.rbac.model.User;
import com.demo.rbac.model.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StudentController {

}
