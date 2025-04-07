package com.demo.rbac.controller.CompreExam;
import com.demo.rbac.dto.ApplicationDto;
import com.demo.rbac.model.CompreExam.Application;
import com.demo.rbac.model.CompreExam.SpecializedSyllabus;
import com.demo.rbac.model.Guide;
import com.demo.rbac.model.Student;
import com.demo.rbac.repository.CompreExam.ApplicationRepository;
import com.demo.rbac.repository.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ApplicationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentRepository studentRepository;

    private ObjectMapper objectMapper;
    private ApplicationController applicationController;

    private Student student;
    private Guide guide;
    private Application application;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        applicationController = new ApplicationController(applicationRepository, studentRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(applicationController).build();
        objectMapper = new ObjectMapper();

        guide = new Guide();
        guide.setId(1L);

        student = new Student();
        student.setEmail("student@example.com");
        student.setRoll("B220780CS");
        student.setName("Manhaas");
        student.setGuide(guide);

        application = new Application();
        application.setId(1L);
        application.setExamId(101L);
        application.setName("Comprehensive Exam");
        application.setStudentEmail(student.getEmail());
        application.setStatus("Submitted");
        application.setStudentRoll(student.getRoll());
        application.setStudentName(student.getName());
        application.setGuideId(guide.getId());
        application.setDateApplied(LocalDateTime.now());

        SpecializedSyllabus s1 = new SpecializedSyllabus();
        s1.setContent("Syllabus A");
        s1.setApplication(application);

        SpecializedSyllabus s2 = new SpecializedSyllabus();
        s2.setContent("Syllabus B");
        s2.setApplication(application);

        application.setSpecializedSyllabi(List.of(s1, s2));
    }

    @Test
    void testCreateApplication() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setExamId(101L);
        dto.setStudentEmail(student.getEmail());
        dto.setName("Comprehensive Exam");
        dto.setStatus("Submitted");
        dto.setGuideComment("Initial");
        dto.setShift("FN");
        dto.setSpecializedSyllabi(List.of("Syllabus A", "Syllabus B"));

        when(studentRepository.findByEmail(anyString())).thenReturn(Optional.of(student));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentEmail").value("student@example.com"))
                .andExpect(jsonPath("$.specializedSyllabi[0].content").value("Syllabus A"))
                .andExpect(jsonPath("$.specializedSyllabi[1].content").value("Syllabus B"));
    }

    @Test
    void testCreateApplication_MissingExamIdOrEmail() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setName("Comprehensive Exam"); // missing examId and studentEmail
    
        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> {
                    Throwable ex = result.getResolvedException();
                    assert ex instanceof ResponseStatusException;
                    assert ex.getMessage().contains("Missing examId or studentEmail");
                });
    }
    

    
    
    

@Test
void testCreateApplication_StudentNotFound() throws Exception {
    ApplicationDto dto = new ApplicationDto();
    dto.setExamId(101L);
    dto.setStudentEmail("missing@student.com");

    when(studentRepository.findByEmail(anyString())).thenReturn(Optional.empty());

    mockMvc.perform(post("/api/applications")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest())
            .andExpect(result -> {
                Throwable ex = result.getResolvedException();
                assert ex instanceof ResponseStatusException;
                assert ex.getMessage().contains("Student not found");
            });
}



    @Test
    void testGetApplicationsForGuide() throws Exception {
        when(applicationRepository.findByGuideId(1L)).thenReturn(List.of(application));

        mockMvc.perform(get("/api/applications/guide/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentRoll").value("B220780CS"));
    }

    @Test
    void testGetApplicationsForGuide_NoApps() throws Exception {
        when(applicationRepository.findByGuideId(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/applications/guide/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testGetApplicationsForStudent() throws Exception {
        when(applicationRepository.findByStudentEmail("student@example.com")).thenReturn(List.of(application));

        mockMvc.perform(get("/api/applications/student/student@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentName").value("Manhaas"));
    }

    @Test
    void testGetApplicationsForStudent_NoApps() throws Exception {
        when(applicationRepository.findByStudentEmail("student@example.com")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/applications/student/student@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testUpdateApplication() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setStatus("Approved");
        dto.setGuideComment("Looks good");
        dto.setSpecializedSyllabi(List.of("Updated Syllabus"));

        SpecializedSyllabus updated = new SpecializedSyllabus();
        updated.setContent("Updated Syllabus");
        updated.setApplication(application);

        application.setStatus("Approved");
        application.setGuideComment("Looks good");
        application.setSpecializedSyllabi(new ArrayList<>(List.of(updated)));

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        mockMvc.perform(put("/api/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Approved"))
                .andExpect(jsonPath("$.specializedSyllabi[0].content").value("Updated Syllabus"));
    }

    @Test
    void testUpdateApplication_NotFound() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setStatus("Rejected");

        when(applicationRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/applications/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateApplication_EmptySyllabi() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setSpecializedSyllabi(new ArrayList<>());

        application.setSpecializedSyllabi(new ArrayList<>());

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        mockMvc.perform(put("/api/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.specializedSyllabi").isEmpty());
    }

    @Test
    void testGetAllApplications() throws Exception {
        SpecializedSyllabus syllabus = new SpecializedSyllabus();
        syllabus.setContent("Syllabus A");
        syllabus.setApplication(application);
    
        application.setSpecializedSyllabi(List.of(syllabus));
        application.setStudentEmail("student@example.com");
    
        when(applicationRepository.findAll()).thenReturn(List.of(application));
    
        mockMvc.perform(get("/api/applications/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentEmail").value("student@example.com"))
                .andExpect(jsonPath("$[0].specializedSyllabi[0]").value("Syllabus A")); // ✅ fixed line
    }
    
}
