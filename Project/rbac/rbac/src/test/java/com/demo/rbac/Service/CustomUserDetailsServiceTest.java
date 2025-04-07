package com.demo.rbac.Service;

import com.demo.rbac.model.Coordinator;
import com.demo.rbac.repository.CoordinatorRepository;
import com.demo.rbac.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

        @Mock
        private CoordinatorRepository coordinatorRepository;

        @InjectMocks
        private CustomUserDetailsService userDetailsService;

        // CORRECT TEST
        @Test
        void testLoadUserByUsername_validUsername_returnsUserDetails() {
            String username = "coordinator@nitc.ac.in";
            Coordinator coordinator = new Coordinator();
            coordinator.setUsername(username);
            coordinator.setPassword("password123");

            when(coordinatorRepository.findByUsername(username)).thenReturn(Optional.of(coordinator));

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            assertNotNull(userDetails);
            assertEquals(username, userDetails.getUsername());
        }

        // WRONG TEST
        @Test
        void testLoadUserByUsername_invalidUsername_throwsException() {
            String username = "nonexistent@nitc.ac.in";

            when(coordinatorRepository.findByUsername(username)).thenReturn(Optional.empty());

            assertThrows(UsernameNotFoundException.class, () -> {
                userDetailsService.loadUserByUsername(username);
            });
        }

        // EDGE CASE TEST
        @Test
        void testLoadUserByUsername_nullUsername_throwsException() {
            assertThrows(UsernameNotFoundException.class, () -> {
                userDetailsService.loadUserByUsername(null);
            });
        }

}

