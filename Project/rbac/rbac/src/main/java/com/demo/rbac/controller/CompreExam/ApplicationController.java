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
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationRepository appRepo;

    @PostMapping("/applications")
    public Application createApplication(@RequestBody ApplicationDto dto) {
        if (dto.getExamId() == null || dto.getStudentEmail() == null) {
            throw new RuntimeException("Missing examId or studentEmail");
        }

        Application application = new Application();
        application.setExamId(dto.getExamId());
        application.setStudentEmail(dto.getStudentEmail());
        application.setStatus(dto.getStatus());
        application.setDateApplied(LocalDateTime.now());

        // Set the comment from the DTO
        application.setComment(dto.getComment());

        List<SpecializedSyllabus> syllabusEntities = new ArrayList<>();
        if (dto.getSpecializedSyllabi() != null) {
            for (String text : dto.getSpecializedSyllabi()) {
                SpecializedSyllabus s = new SpecializedSyllabus();
                s.setContent(text);
                s.setApplication(application);
                syllabusEntities.add(s);
            }
        }
        application.getSpecializedSyllabi().addAll(syllabusEntities);
        return appRepo.save(application);
    }

    @GetMapping("/applications/student/{email}")
    public List<Application> getStudentApplications(@PathVariable String email) {
        return appRepo.findByStudentEmail(email);
    }
}
