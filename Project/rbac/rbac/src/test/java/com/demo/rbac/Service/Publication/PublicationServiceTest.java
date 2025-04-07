package com.demo.rbac.Service.Publication;

import com.demo.rbac.service.publications.PublicationService;
import com.demo.rbac.dto.PublicationRequest;
import com.demo.rbac.model.Publication;
import com.demo.rbac.repository.PublicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PublicationServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @InjectMocks
    private PublicationService publicationService;

    private Publication samplePublication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        samplePublication = new Publication();
        samplePublication.setId(1L);
        samplePublication.setTitle("AI in Healthcare");
        samplePublication.setPublishername("IEEE");
        samplePublication.setJournal("IEEE Access");
        samplePublication.setDoi("10.1109/access.123456");
        samplePublication.setPublicationType("Journal");
        samplePublication.setStatus("Under Review");
        samplePublication.setIndexing("Scopus");
        samplePublication.setQuartile("Q1");
        samplePublication.setRollNo("P220545CS");
        samplePublication.setDateOfSubmission(LocalDate.of(2025, 4, 1));
    }

    @Test
    void testSavePublication() {
        when(publicationRepository.save(samplePublication)).thenReturn(samplePublication);

        Publication saved = publicationService.savePublication(samplePublication);
        assertEquals("AI in Healthcare", saved.getTitle());
        verify(publicationRepository).save(samplePublication);
    }

    @Test
    void testGetAllPublications() {
        when(publicationRepository.findAll()).thenReturn(List.of(samplePublication));

        List<Publication> result = publicationService.getAllPublications();
        assertEquals(1, result.size());
        assertEquals("P220545CS", result.get(0).getRollNo());
    }

    @Test
    void testGetPublicationById_found() {
        when(publicationRepository.findById(1L)).thenReturn(Optional.of(samplePublication));

        Optional<Publication> result = publicationService.getPublicationById(1L);
        assertTrue(result.isPresent());
        assertEquals("IEEE Access", result.get().getJournal());
    }

    @Test
    void testGetPublicationById_notFound() {
        when(publicationRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<Publication> result = publicationService.getPublicationById(2L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetPublicationsByRollNo() {
        when(publicationRepository.findByRollNo("P220545CS")).thenReturn(List.of(samplePublication));

        List<Publication> result = publicationService.getPublicationsByRollNo("P220545CS");
        assertEquals(1, result.size());
    }

    @Test
    void testUpdatePublicationStatus_found() {
        when(publicationRepository.findById(1L)).thenReturn(Optional.of(samplePublication));
        when(publicationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Optional<Publication> result = publicationService.updatePublicationStatus(1L, "Accepted");
        assertTrue(result.isPresent());
        assertEquals("Accepted", result.get().getStatus());
    }

    @Test
    void testUpdatePublicationStatus_notFound() {
        when(publicationRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<Publication> result = publicationService.updatePublicationStatus(2L, "Rejected");
        assertTrue(result.isEmpty());
    }

    @Test
    void testSavePublicationFromRequest() {
        PublicationRequest request = new PublicationRequest();
        request.setTitle("Edge AI");
        request.setPublishername("Elsevier");
        request.setJournal("Future Generation Computer Systems");
        request.setDoi("10.1016/j.future.2025.01.001");
        request.setPublicationType("Conference");
        request.setStatus("Submitted");
        request.setIndexing("SCI");
        request.setQuartile("Q2");
        request.setRollNo("P220123CS");
        request.setDateOfSubmission(LocalDate.of(2025, 3, 15));

        when(publicationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Publication saved = publicationService.savePublication(request);
        assertEquals("Edge AI", saved.getTitle());
        assertEquals("P220123CS", saved.getRollNo());
    }
}
