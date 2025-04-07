package com.demo.rbac.Service.CompreExam;

import com.demo.rbac.model.CompreExam.ExamAnnouncement;
import com.demo.rbac.service.CompreExam.ExamAnnouncementService;
import com.demo.rbac.repository.CompreExam.ExamAnnouncementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExamAnnouncementServiceTest {

    @Mock
    private ExamAnnouncementRepository examAnnouncementRepository;

    @InjectMocks
    private ExamAnnouncementService examAnnouncementService;

    private ExamAnnouncement sampleExam;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleExam = new ExamAnnouncement();
        sampleExam.setId(1L);
        sampleExam.setName("Comprehensive Exam 2025");
        sampleExam.setExamDate(LocalDate.of(2025, 5, 20));
        sampleExam.setDeadline(LocalDate.of(2025, 5, 10));
        sampleExam.setExamVenue("Auditorium A");
        sampleExam.setExamDuration("2 hours");
        sampleExam.setExamShift("Morning");
        sampleExam.setBroadcast(true);
    }

    @Test
    void testSaveExamAnnouncement() {
        when(examAnnouncementRepository.save(sampleExam)).thenReturn(sampleExam);

        ExamAnnouncement saved = examAnnouncementService.saveExamAnnouncement(sampleExam);
        assertNotNull(saved);
        assertEquals("Comprehensive Exam 2025", saved.getName());
        verify(examAnnouncementRepository, times(1)).save(sampleExam);
    }

    @Test
    void testGetAllExamAnnouncements() {
        when(examAnnouncementRepository.findAll()).thenReturn(List.of(sampleExam));

        List<ExamAnnouncement> announcements = examAnnouncementService.getAllExamAnnouncements();
        assertEquals(1, announcements.size());
        assertEquals("Comprehensive Exam 2025", announcements.get(0).getName());
        verify(examAnnouncementRepository, times(1)).findAll();
    }

    @Test
    void testUpdateExamAnnouncement_success() {
        when(examAnnouncementRepository.findById(1L)).thenReturn(Optional.of(sampleExam));
        when(examAnnouncementRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ExamAnnouncement updated = new ExamAnnouncement();
        updated.setName("Updated Exam");
        updated.setExamDate(LocalDate.of(2025, 6, 1));
        updated.setDeadline(LocalDate.of(2025, 5, 25));
        updated.setExamVenue("Hall B");
        updated.setExamDuration("3 hours");
        updated.setExamShift("Afternoon");
        updated.setBroadcast(false);

        ExamAnnouncement result = examAnnouncementService.updateExamAnnouncement(1L, updated);
        assertEquals("Updated Exam", result.getName());
        assertEquals("3 hours", result.getExamDuration());
        verify(examAnnouncementRepository).findById(1L);
        verify(examAnnouncementRepository).save(any());
    }

    @Test
    void testUpdateExamAnnouncement_notFound() {
        when(examAnnouncementRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                examAnnouncementService.updateExamAnnouncement(1L, sampleExam)
        );
        assertEquals("Exam not found with id 1", exception.getMessage());
        verify(examAnnouncementRepository).findById(1L);
    }

    @Test
    void testDeleteExamAnnouncement() {
        examAnnouncementService.deleteExamAnnouncement(1L);
        verify(examAnnouncementRepository).deleteById(1L);
    }
}
