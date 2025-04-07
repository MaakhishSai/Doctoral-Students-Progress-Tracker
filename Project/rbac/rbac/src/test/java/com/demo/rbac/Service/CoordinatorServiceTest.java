package com.demo.rbac.Service;

import com.demo.rbac.model.Coordinator;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.repository.CoordinatorRepository;
import com.demo.rbac.service.CoordinatorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CoordinatorServiceTest {

    @Mock
    private CoordinatorRepository coordinatorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CoordinatorService coordinatorService;

    // CORRECT TEST
    @Test
    void testInitializeCoordinator_whenRepositoryIsEmpty_savesCoordinator() {
        when(coordinatorRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        coordinatorService.initializeCoordinator();

        ArgumentCaptor<Coordinator> captor = ArgumentCaptor.forClass(Coordinator.class);
        verify(coordinatorRepository).save(captor.capture());

        Coordinator savedCoordinator = captor.getValue();
        assertEquals("coordinator", savedCoordinator.getUsername());
        assertEquals("encodedPassword", savedCoordinator.getPassword());
        assertEquals(UserRole.COORDINATOR, savedCoordinator.getUserRole());
    }

    // WRONG TEST
    @Test
    void testInitializeCoordinator_whenCoordinatorExists_doesNotSave() {
        when(coordinatorRepository.count()).thenReturn(1L);

        coordinatorService.initializeCoordinator();

        verify(coordinatorRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    //  EDGE CASE
    @Test
    void testInitializeCoordinator_saveFails_throwsException() {
        when(coordinatorRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(coordinatorRepository.save(any())).thenThrow(new RuntimeException("DB Error"));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            coordinatorService.initializeCoordinator();
        });

        assertEquals("DB Error", exception.getMessage());
    }
}
