package com.demo.rbac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "publications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String journal;
    private String doi;
    private String publicationType;
    private String status;
    private boolean sendCopyToCoordinator;
    private String quartile;
    
    @Column(name = "roll_no", nullable = false) // ✅ Store only a single roll number
    private String rollNo;  
}
