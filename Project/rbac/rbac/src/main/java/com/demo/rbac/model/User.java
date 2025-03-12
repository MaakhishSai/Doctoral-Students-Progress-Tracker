package com.demo.rbac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private long id;

    @Column(unique = true)
    private String email;

    // for coordinator only this exists
    // for all others it is null
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    // username column is present in database not in entity class
    @Column(nullable = true) // Username can be optional
    private String username;

    // fixed datatype for enabled field
    @Column(columnDefinition = "BIT(1)")
    private boolean enabled = true;

    // For student-supervisor mapping
    @ManyToOne
    @JoinColumn(name = "supervisor_id")
    // this is a foreign key mapping for supervisor relationship
    // many students to single supervisor
    private User supervisor;

    public User(String email, String password, UserRole role){
        this.email = email;
        this.password = password;
        this.userRole = role;
    }
    public User(String email, UserRole role) {
        this.email = email;
        this.userRole = role;
    }

    public UserRole getUserRole() {
        System.out.println("we are entering here ig getUserRole");
        return userRole;
    }
}
