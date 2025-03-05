package com.demo.rbac.service;

import com.demo.rbac.model.User; // Import your entity class
import com.demo.rbac.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CoordinatorDetailsService implements UserDetailsService {
    private final UserRepository coordinatorRepository;
    private final PasswordEncoder passwordEncoder;

    public CoordinatorDetailsService(UserRepository coordinatorRepository, PasswordEncoder passwordEncoder) {
        this.coordinatorRepository = coordinatorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = coordinatorRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Coordinator not found"));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(), // Ensure password is stored as a hash
                user.isEnabled(),
                true,
                true,
                true,
                Collections.singletonList(authority)// Assign roles dynamically
                );
    }
}
