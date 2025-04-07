package com.demo.rbac.Service.Publication;

import com.demo.rbac.service.publications.PublicationhistoryService;
import com.demo.rbac.dto.PublicationhRequest;
import com.demo.rbac.model.Publicationhistory;
import com.demo.rbac.repository.PublicationhRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PublicationhistoryTest {

    @Mock
    private PublicationhRepository publicationhRepository;

    @InjectMocks
    private PublicationhistoryService service;

    private Publicationhistory sampleHistory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleHistory = new Publicationhistory();
        sampleHistory.setId(1L);
        sampleHistory.setTitle("AI and Society");
        sampleHistory.setPublishername("IEEE");
        sampleHistory.setJournal("IEEE Transactions");
        sampleHistory.setDoi("10.1109/xyz");
        sampleHistory.setPublicationType("Journal");
        sampleHistory.setStatus("Submitted");
        sampleHistory.setQuartile("Q1");
        sampleHistory.setRollNo("P220545CS");
        sampleHistory.setDateOfSubmission(LocalDate.of(2025, 4, 5));
    }

    @Test
    void testSavePublicationHistory_shouldSaveNew() {
        PublicationhRequest request = new PublicationhRequest();
        request.setTitle("AI and Society");
        request.setPublishername("IEEE");
        request.setJournal("IEEE Transactions");
        request.setDoi("10.1109/xyz");
        request.setPublicationType("Journal");
        request.setStatus("Revised");
        request.setQuartile("Q1");
        request.setRollNo("P220545CS");
        request.setDateOfSubmission(LocalDate.of(2025, 4, 5));

        when(publicationhRepository.findTopByTitleAndRollNoOrderByIdDesc("AI and Society", "P220545CS"))
                .thenReturn(Optional.of(sampleHistory));

        // Status is different -> should save
        when(publicationhRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Publicationhistory saved = service.savePublicationHistory(request);

        assertNotNull(saved);
        assertEquals("Revised", saved.getStatus());
        verify(publicationhRepository).save(any(Publicationhistory.class));
    }

    @Test
    void testSavePublicationHistory_shouldNotSaveDuplicate() {
        PublicationhRequest request = new PublicationhRequest();
        request.setTitle("AI and Society");
        request.setRollNo("P220545CS");
        request.setStatus("Submitted");
        request.setDateOfSubmission(LocalDate.of(2025, 4, 5));

        when(publicationhRepository.findTopByTitleAndRollNoOrderByIdDesc("AI and Society", "P220545CS"))
                .thenReturn(Optional.of(sampleHistory));

        Publicationhistory result = service.savePublicationHistory(request);
        assertNull(result); // duplicate, shouldn't save
    }

    @Test
    void testSaveNewPublicationHistory_shouldAlwaysSave() {
        when(publicationhRepository.save(sampleHistory)).thenReturn(sampleHistory);

        Publicationhistory saved = service.saveNewPublicationHistory(sampleHistory);
        assertNotNull(saved);
        assertEquals("IEEE", saved.getPublishername());
        verify(publicationhRepository).save(sampleHistory);
    }

    @Test
    void testGetLatestHistoryByTitleAndRollNo() {
        when(publicationhRepository.findTopByTitleAndRollNoOrderByIdDesc("AI and Society", "P220545CS"))
                .thenReturn(Optional.of(sampleHistory));

        Optional<Publicationhistory> result = service.getLatestHistoryByTitleAndRollNo("AI and Society", "P220545CS");

        assertTrue(result.isPresent());
        assertEquals("Submitted", result.get().getStatus());
    }

    @Test
    void testGetPublicationHistoryById_found() {
        when(publicationhRepository.findById(1L)).thenReturn(Optional.of(sampleHistory));

        Optional<Publicationhistory> result = service.getPublicationHistoryById(1L);
        assertTrue(result.isPresent());
        assertEquals("P220545CS", result.get().getRollNo());
    }

    @Test
    void testGetPublicationHistoryById_notFound() {
        when(publicationhRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Publicationhistory> result = service.getPublicationHistoryById(99L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetHistoryByRollNo() {
        when(publicationhRepository.findByRollNo("P220545CS")).thenReturn(List.of(sampleHistory));

        List<Publicationhistory> result = service.getHistoryByRollNo("P220545CS");
        assertEquals(1, result.size());
    }
}
