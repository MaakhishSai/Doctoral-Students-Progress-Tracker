package com.demo.rbac.Service.CompreExam;

import com.demo.rbac.service.CompreExam.CommentService;
import com.demo.rbac.model.CompreExam.Comment;
import com.demo.rbac.model.CompreExam.ExamAnnouncement;
import com.demo.rbac.repository.CompreExam.CommentRepository;
import com.demo.rbac.repository.CompreExam.ExamAnnouncementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @InjectMocks
    private CommentService commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ExamAnnouncementRepository examRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveComment_validExamAnnouncement_savesSuccessfully() {
        // Arrange
        Long examId = 1L;
        String studentEmail = "student@example.com";
        String commentText = "Looking forward to the exam.";

        ExamAnnouncement mockExam = new ExamAnnouncement();
        mockExam.setId(examId);

        Comment mockSavedComment = new Comment();
        mockSavedComment.setId(100L);
        mockSavedComment.setStudentEmail(studentEmail);
        mockSavedComment.setComment(commentText);
        mockSavedComment.setExamAnnouncement(mockExam);
        mockSavedComment.setTimestamp(LocalDateTime.now());

        when(examRepository.findById(examId)).thenReturn(Optional.of(mockExam));
        when(commentRepository.save(any(Comment.class))).thenReturn(mockSavedComment);

        // Act
        Comment result = commentService.saveComment(examId, studentEmail, commentText);

        // Assert
        assertNotNull(result);
        assertEquals(studentEmail, result.getStudentEmail());
        assertEquals(commentText, result.getComment());
        assertEquals(mockExam, result.getExamAnnouncement());
        assertNotNull(result.getTimestamp());

        verify(examRepository, times(1)).findById(examId);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testSaveComment_examAnnouncementNotFound_throwsException() {
        Long invalidExamId = 999L;
        when(examRepository.findById(invalidExamId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> commentService.saveComment(invalidExamId, "student@example.com", "Test Comment"));

        assertEquals("Exam announcement not found", exception.getMessage());
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testGetCommentsByExamAnnouncementId_returnsComments() {
        Long examId = 2L;

        Comment c1 = new Comment(1L, null, "student1@example.com", "Nice!", LocalDateTime.now());
        Comment c2 = new Comment(2L, null, "student2@example.com", "Great!", LocalDateTime.now());
        List<Comment> mockComments = List.of(c1, c2);

        when(commentRepository.findByExamAnnouncementId(examId)).thenReturn(mockComments);

        List<Comment> result = commentService.getCommentsByExamAnnouncementId(examId);

        assertEquals(2, result.size());
        assertEquals("student1@example.com", result.get(0).getStudentEmail());

        verify(commentRepository, times(1)).findByExamAnnouncementId(examId);
    }
}
