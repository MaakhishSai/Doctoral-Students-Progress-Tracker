package com.demo.rbac.controller.CompreExam;

import com.demo.rbac.model.CompreExam.Comment;
import com.demo.rbac.model.CompreExam.ExamAnnouncement;
import com.demo.rbac.service.CompreExam.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class CommentControllerTest {

    private MockMvc mockMvc;
    private CommentService commentService;
    private ObjectMapper objectMapper;

    private CommentController.CommentRequest commentRequest;
    private Comment sampleComment;

    @BeforeEach
    void setUp() {
        commentService = mock(CommentService.class);
        CommentController controller = new CommentController(commentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();

        commentRequest = new CommentController.CommentRequest();
        commentRequest.setStudentEmail("student@example.com");
        commentRequest.setComment("This is a test comment");

        ExamAnnouncement exam = new ExamAnnouncement();
        exam.setId(101L);
        exam.setName("Comprehensive Exam");

        sampleComment = new Comment();
        sampleComment.setId(1L);
        sampleComment.setExamAnnouncement(exam);
        sampleComment.setStudentEmail("student@example.com");
        sampleComment.setComment("This is a test comment");
        sampleComment.setTimestamp(LocalDateTime.now());
    }

    @Test
    void testAddComment() throws Exception {
        when(commentService.saveComment(eq(101L), eq("student@example.com"), eq("This is a test comment")))
                .thenReturn(sampleComment);

        mockMvc.perform(post("/api/exams/101/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentEmail").value("student@example.com"))
                .andExpect(jsonPath("$.comment").value("This is a test comment"));
    }

    @Test
    void testGetComments() throws Exception {
        when(commentService.getCommentsByExamAnnouncementId(101L)).thenReturn(List.of(sampleComment));

        mockMvc.perform(get("/api/exams/101/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentEmail").value("student@example.com"))
                .andExpect(jsonPath("$[0].comment").value("This is a test comment"));
    }

    @Test
    void testAddCommentMissingEmail() throws Exception {
        commentRequest.setStudentEmail(null);

        mockMvc.perform(post("/api/exams/101/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddCommentMissingContent() throws Exception {
        commentRequest.setComment("");

        mockMvc.perform(post("/api/exams/101/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddCommentInvalidContentType() throws Exception {
        mockMvc.perform(post("/api/exams/101/comments")
                        .content("raw string"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void testAddVeryLongComment() throws Exception {
        StringBuilder longComment = new StringBuilder();
        for (int i = 0; i < 10000; i++) {
            longComment.append("a");
        }
        commentRequest.setComment(longComment.toString());

        when(commentService.saveComment(eq(101L), eq("student@example.com"), any()))
                .thenReturn(sampleComment);

        mockMvc.perform(post("/api/exams/101/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCommentsEmpty() throws Exception {
        when(commentService.getCommentsByExamAnnouncementId(202L)).thenReturn(List.of());

        mockMvc.perform(get("/api/exams/202/comments"))
                .andExpect(status().isOk())
                .andExpect(content().string("[]"));
    }

    @Test
    void testGetMultipleComments() throws Exception {
        Comment secondComment = new Comment();
        secondComment.setId(2L);
        secondComment.setStudentEmail("another@student.com");
        secondComment.setComment("Second comment");
        secondComment.setTimestamp(LocalDateTime.now());

        when(commentService.getCommentsByExamAnnouncementId(101L))
                .thenReturn(List.of(sampleComment, secondComment));

        mockMvc.perform(get("/api/exams/101/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].studentEmail").value("another@student.com"));
    }
}
