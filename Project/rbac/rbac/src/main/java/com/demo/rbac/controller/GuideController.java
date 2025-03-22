package com.demo.rbac.controller;

import java.util.List;

import com.demo.rbac.dto.GuideDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.rbac.dto.StudentUnderGuideDTO;
import com.demo.rbac.service.GuideService;
import com.demo.rbac.service.student.StudentService;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final StudentService studentService;
    private final GuideService guideService;

    public GuideController(StudentService studentService, GuideService guideService) {
        this.studentService = studentService;
        this.guideService = guideService;
    }

    @GetMapping("/{guideId}/students")
public ResponseEntity<List<StudentUnderGuideDTO>> getStudentsUnderGuide(@PathVariable Long guideId) {
    List<StudentUnderGuideDTO> students = studentService.getStudentsUnderGuide(guideId);
    System.out.println("Returning students: " + students); // ✅ Debug log
    return ResponseEntity.ok(students);
}

@GetMapping("/{guideId}")
public ResponseEntity<GuideDTO> getGuideById(@PathVariable Long guideId) {
    GuideDTO guide = guideService.getGuideById(guideId);
    return (guide != null) ? ResponseEntity.ok(guide) : ResponseEntity.notFound().build();
}

    @GetMapping("/email/{email}")
    public ResponseEntity<Long> getGuideIdByEmail(@PathVariable String email) {
        Long guideId = guideService.getGuideIdByEmail(email);
        return (guideId != null) ? ResponseEntity.ok(guideId) : ResponseEntity.notFound().build();
    }

}
