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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String email;

    // for coordinator only this exists
    // for all others it is null
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private boolean enabled = true;

    // For student-supervisor mapping
    @ManyToOne
    @JoinColumn(name = "supervisor_id")
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
