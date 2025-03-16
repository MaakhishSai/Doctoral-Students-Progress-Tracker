package com.demo.rbac.controller;

import com.demo.rbac.model.Student;
import com.demo.rbac.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/profile")
    public Map<String, String> getProfile(@AuthenticationPrincipal OAuth2User oAuth2User) {
        if (oAuth2User == null) {
            throw new RuntimeException("User not authenticated");
        }

        // Extracting user information from OAuth2User
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        // obtaining roll no from here itself
        int endIdx = email.indexOf("nitc.ac.in");
        endIdx--;
        int startIdx = endIdx - 9;
        String sub = email.substring(startIdx, endIdx);
        String rollno = sub.toUpperCase();
        // Preparing the response as a JSON object
        Map<String, String> response = new HashMap<>();
        response.put("name", name);
        response.put("email", email);
        response.put("rollNumber", rollno);

        // Fetch the student record from the database to get ORCID and area of research
        Optional<Student> studentOpt = studentService.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            response.put("orcid", student.getOrcid() != null ? student.getOrcid() : "");
            response.put("areaofresearch", student.getAreaofresearch() != null ? student.getAreaofresearch() : "");
        } else {
            // Student record not found, return empty strings
            response.put("orcid", "");
            response.put("areaofresearch", "");
        }

        return response;
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Student updatedStudent) {
        Optional<Student> existingStudent = studentService.findByEmail(updatedStudent.getEmail());

        System.out.println("entering put ");
        if (existingStudent.isPresent()) {
            Student student = existingStudent.get();
            student.setOrcid(updatedStudent.getOrcid());
            student.setAreaofresearch(updatedStudent.getAreaofresearch());
            studentService.saveStudent(student);  // Save updated student

            return ResponseEntity.ok("Profile updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
        }
    }

}
