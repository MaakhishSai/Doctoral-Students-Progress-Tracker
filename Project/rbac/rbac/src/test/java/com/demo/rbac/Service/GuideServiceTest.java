package com.demo.rbac.Service;

import com.demo.rbac.dto.GuideDTO;
import com.demo.rbac.model.Guide;
import com.demo.rbac.repository.GuideRepository;
import com.demo.rbac.service.GuideService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GuideServiceTest {

    @Mock
    private GuideRepository guideRepository;

    @InjectMocks
    private GuideService guideService;

    // CORRECT TEST
    @Test
    void testGetGuideById_validId_returnsGuideDTO() {
        Long guideId = 1L;
        Guide guide = new Guide();
        guide.setId(guideId);
        guide.setName("Dr. John");
        guide.setEmail("john@example.com");

        when(guideRepository.findById(guideId)).thenReturn(Optional.of(guide));

        GuideDTO dto = guideService.getGuideById(guideId);

        assertNotNull(dto);
        assertEquals(guideId, dto.getId());
        assertEquals("Dr. John", dto.getName());
        assertEquals("john@example.com", dto.getEmail());
    }

    // WRONG TEST
    @Test
    void testGetGuideIdByEmail_emailNotFound_returnsNull() {
        String email = "unknown@example.com";
        when(guideRepository.findGuideIdByEmail(email)).thenReturn(Optional.empty());

        Long guideId = guideService.getGuideIdByEmail(email);

        assertNull(guideId);
    }

    // EDGE CASE
    @Test
    void testGetGuideById_nullId_returnsNull() {
        GuideDTO dto = guideService.getGuideById(null);
        assertNull(dto);
    }
}
