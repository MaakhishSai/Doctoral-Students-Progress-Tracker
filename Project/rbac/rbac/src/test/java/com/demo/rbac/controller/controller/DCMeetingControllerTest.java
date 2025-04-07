package com.demo.rbac.controller.controller;

import com.demo.rbac.config.TestSecurityConfig;
import com.demo.rbac.controller.DCMeetingController;
import com.demo.rbac.model.DCMeeting;
import com.demo.rbac.model.Guide;
import com.demo.rbac.model.Student;
import com.demo.rbac.repository.DCMeetingRepository;
import com.demo.rbac.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(TestSecurityConfig.class)
@WebMvcTest(DCMeetingController.class)
class DCMeetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DCMeetingRepository dcMeetingRepository;

    @MockBean
    private StudentRepository studentRepository;

    @Test
    @WithMockUser(username = "student1@domain.com")
    void testCreateMeeting() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", MediaType.TEXT_PLAIN_VALUE, "Test content".getBytes());

        mockMvc.perform(multipart("/api/dc-meetings/create")
                        .file(file)
                        .param("date", "2025-04-07")
                        .param("time", "10:30")
                        .param("writeup", "Project update")
                        .param("status", "draft"))
                .andExpect(status().isOk())
                .andExpect(content().string("Meeting created successfully"));

        verify(dcMeetingRepository, times(1)).save(ArgumentMatchers.any(DCMeeting.class));
    }

    @Test
    @WithMockUser(username = "student1@domain.com")
    void testFetchMeetings() throws Exception {
        DCMeeting meeting = new DCMeeting();
        meeting.setId(1L);
        meeting.setDate(LocalDate.now());
        meeting.setTime(LocalTime.of(10, 30));
        meeting.setWriteup("Writeup");
        meeting.setStatus("draft");
        meeting.setStudentEmail("student1@domain.com");
        meeting.setFileName("test.txt");
        meeting.setComments("Looks good");

        when(dcMeetingRepository.findByStudentEmail("student1@domain.com"))
                .thenReturn(Collections.singletonList(meeting));

        mockMvc.perform(get("/api/dc-meetings/fetch"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].status").value("draft"));
    }

    @Test
    @WithMockUser(username = "student1@domain.com")
    void testSubmitMeeting() throws Exception {
        DCMeeting meeting = new DCMeeting();
        meeting.setId(1L);
        meeting.setStudentEmail("student1@domain.com");
        meeting.setStatus("draft");

        when(dcMeetingRepository.findById(1L)).thenReturn(Optional.of(meeting));

        mockMvc.perform(put("/api/dc-meetings/submit/1")
                        .principal(() -> "student1@domain.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("Meeting status updated to Submitted successfully"));
    }


    @Test
    @WithMockUser(username = "guide@domain.com")
    void testUpdateStatusBySupervisor() throws Exception {
        DCMeeting meeting = new DCMeeting();
        meeting.setId(1L);
        meeting.setStudentEmail("student1@domain.com");

        Student student = new Student();
        student.setEmail("student1@domain.com");

        Guide guide = new Guide();
        guide.setEmail("guide@domain.com");
        student.setGuide(guide);

        when(dcMeetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(studentRepository.findByEmail("student1@domain.com")).thenReturn(Optional.of(student));

        mockMvc.perform(put("/api/dc-meetings/supervisor-action/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"approved\", \"comments\": \"Good work\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Status updated to approved"));
    }
}
