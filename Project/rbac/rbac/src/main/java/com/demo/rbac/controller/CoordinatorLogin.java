package com.demo.rbac.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CoordinatorLogin {

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // Refers to `src/main/resources/templates/login.html`
    }
}
