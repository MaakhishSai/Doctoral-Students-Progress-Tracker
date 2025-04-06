package com.demo.rbac.controller.CompreExam;

import com.demo.rbac.model.CompreExam.ExamAnnouncement;
import com.demo.rbac.service.CompreExam.ExamAnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamAnnoucementController {

    @Autowired
    private ExamAnnouncementService examService;
    public ExamAnnoucementController(ExamAnnouncementService examService) {
        this.examService = examService;
    }
    @PostMapping("/announce")
    public ResponseEntity<?> announceExam(@RequestBody ExamAnnouncement examAnnouncement) {
        if (!examAnnouncement.isBroadcast()) {
            System.out.println("not null broadcast post req");
            return ResponseEntity.badRequest().body("Exam announcement must be broadcasted.");
        }
        ExamAnnouncement savedExam = examService.saveExamAnnouncement(examAnnouncement);
        return ResponseEntity.ok(savedExam);
    }

    @GetMapping
    public ResponseEntity<List<ExamAnnouncement>> getExams() {
        List<ExamAnnouncement> exams = examService.getAllExamAnnouncements();
        return ResponseEntity.ok(exams);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody ExamAnnouncement examAnnouncement) {
        try {
            ExamAnnouncement updated = examService.updateExamAnnouncement(id, examAnnouncement);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

}

