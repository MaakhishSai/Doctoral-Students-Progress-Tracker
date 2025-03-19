package com.demo.rbac.controller.CompreExam;

import com.demo.rbac.dto.ApplicationDto;
import com.demo.rbac.model.CompreExam.Application;
import com.demo.rbac.model.CompreExam.SpecializedSyllabus;
import com.demo.rbac.repository.CompreExam.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    private ApplicationRepository appRepo;

    @PostMapping("/applications")
    public Application createApplication(@RequestBody ApplicationDto dto) {
        if (dto.getExamId() == null || dto.getStudentRollNo() == null) {
            throw new RuntimeException("Missing examId or studentRollNo");
        }

        // 1) Create the parent Application
        Application application = new Application();
        application.setExamId(dto.getExamId());
        System.out.println(dto.getStudentRollNo());
        application.setStudentRollNo(dto.getStudentRollNo());
        application.setStatus(dto.getStatus()); // from JSON
        application.setDateApplied(LocalDateTime.now());

        // 2) Convert each syllabus text into a SpecializedSyllabus entity
        List<SpecializedSyllabus> syllabusEntities = new ArrayList<>();
        if (dto.getSpecializedSyllabi() != null) {
            for (String text : dto.getSpecializedSyllabi()) {
                SpecializedSyllabus s = new SpecializedSyllabus();
                s.setContent(text);
                s.setApplication(application); // link child -> parent
                syllabusEntities.add(s);
            }
        }

        // 3) Attach them to the application
        application.getSpecializedSyllabi().addAll(syllabusEntities);

        // 4) Save the parent, which cascades & saves children
        return appRepo.save(application);
    }

    @GetMapping("/student/{rollNo}")
    public List<Application> getStudentApplications(@PathVariable String rollNo) {
        return appRepo.findByStudentRollNo(rollNo);
    }

}