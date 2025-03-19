package com.demo.rbac.model.CompreExam;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long examId;           // which exam the student is applying for
    private String studentRollNo;  // e.g., "P220545CS"
    private LocalDateTime dateApplied;

    private String status;

    // ONE Application -> MANY Syllabi
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpecializedSyllabus> specializedSyllabi = new ArrayList<>();

}
