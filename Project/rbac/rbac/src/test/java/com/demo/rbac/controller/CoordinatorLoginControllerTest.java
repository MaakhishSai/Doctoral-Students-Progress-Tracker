package com.demo.rbac.controller;

import com.demo.rbac.model.Coordinator;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.repository.CoordinatorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CoordinatorLoginControllerTest {

    private MockMvc mockMvc;
    private AuthenticationManager authenticationManager;
    private CoordinatorRepository coordinatorRepository;
    @BeforeEach
    void setUp() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        coordinatorRepository = Mockito.mock(CoordinatorRepository.class);

        CoordinatorLoginController controller = new CoordinatorLoginController(authenticationManager, coordinatorRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        new ObjectMapper();
    }

    @Test
    void testLogin_Success() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken("coordinator", "password");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        Coordinator coordinator = new Coordinator();
        coordinator.setUsername("coordinator");
        coordinator.setUserRole(UserRole.COORDINATOR);

        when(coordinatorRepository.findByUsername("coordinator")).thenReturn(Optional.of(coordinator));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "username": "coordinator",
                                "password": "securepassword"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful!"))
                .andExpect(jsonPath("$.role").value("COORDINATOR"));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken("invalid", "password");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(coordinatorRepository.findByUsername("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "username": "invalid",
                                "password": "password"
                            }
                        """))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    @Test
    void testGoogleOAuthRedirect_WithRole() throws Exception {
        mockMvc.perform(get("/api/auth/oauth2/authorization/google")
                        .param("role", "student"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/oauth2/authorization/google"));
    }

    @Test
    void testGoogleOAuthRedirect_WithoutRole() throws Exception {
        mockMvc.perform(get("/api/auth/oauth2/authorization/google"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/oauth2/authorization/google"));
    }
}
