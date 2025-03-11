package com.demo.rbac.service;

import com.demo.rbac.model.User;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MappingService mappingService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(String email, String password, UserRole role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, role);

            if(role == UserRole.COORDINATOR) {
                String hashedPassword = passwordEncoder.encode(password);
                newUser = new User(email, hashedPassword, role);
            }
            else{
                String hashedPassword = passwordEncoder.encode(password);
                newUser = new User(email,hashedPassword, role);
            }

            if (role == UserRole.STUDENT) {
                String supervisorEmail = mappingService.getSupervisorEmail(email);
                if (supervisorEmail != null) {
                    // Find or create supervisor without creating a recursive loop
                    User supervisor = userRepository.findByEmail(supervisorEmail)
                            .orElseGet(() -> {
                                User newSupervisor = new User(supervisorEmail, UserRole.SUPERVISOR);
                                return userRepository.save(newSupervisor);
                            });
                    newUser.setSupervisor(supervisor);
                }
            }
            if(role == UserRole.SUPERVISOR) {
                String hashedPassword = passwordEncoder.encode(password);
               System.out.println("am i entering create user for supervisor");
                User newSupervisor = new User(email,hashedPassword,UserRole.SUPERVISOR);
//                System.out.println(newSupervisor.getUserRole().name());
                newUser = newSupervisor;
            }
//            System.out.println("did i come out of that if");
            // not working for my mail here
            System.out.println("Checking database connection...");
            long count = userRepository.count();
            System.out.println("Database is accessible, total users: " + count);
            return userRepository.save(newUser);
        });
    }

    public boolean isAuthorizedFromMapping(String email, UserRole role) {
        // am i entering here
//        System.out.print("entering the isAuthorizedFromMapping function");
        // for my mail we are entering here
        return switch (role) {
            case STUDENT -> {
                // for my mail we are entering here
                // go to isStudentInMapping function
                // go to MappingService Class
                yield mappingService.isStudentInMapping(email);
            }
            case SUPERVISOR -> {
                System.out.println("entering supervisor role");
                yield mappingService.isSupervisorInMapping(email);
            }
            default -> false; // Coordinators are handled separately
        };
    }

    @PostConstruct
    public void createDefaultCoordinator() {
        String email = "coordinator";
        String rawPassword = "securepassword"; // Default password
        String hashedPassword = passwordEncoder.encode(rawPassword);

        if (userRepository.findByEmail(email).isEmpty()) {
            User coordinator = new User(email, hashedPassword, UserRole.COORDINATOR);
            userRepository.save(coordinator);
            System.out.println("Default Coordinator Created: username = " + email + ", password = " + rawPassword);
        }
    }

}
