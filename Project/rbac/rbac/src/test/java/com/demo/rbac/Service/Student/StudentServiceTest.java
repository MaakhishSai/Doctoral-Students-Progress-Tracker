package com.demo.rbac.Service.Student;

import com.demo.rbac.model.Guide;
import com.demo.rbac.model.Student;
import com.demo.rbac.repository.GuideRepository;
import com.demo.rbac.repository.PublicationRepository;
import com.demo.rbac.repository.StudentRepository;
import com.demo.rbac.service.student.ExcelHelper;
import com.demo.rbac.service.student.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private GuideRepository guideRepository;

    @Mock
    private PublicationRepository publicationRepository;

    @Mock
    private ExcelHelper excelHelper;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveStudentsFromExcel_validFileWithExistingGuide_shouldSaveStudents() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getContentType()).thenReturn("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        InputStream inputStream = new ByteArrayInputStream(new byte[0]);
        when(mockFile.getInputStream()).thenReturn(inputStream);

        Guide guide = new Guide("Dr. John", "john@nitc.ac.in");
        Student student = new Student();
        student.setRoll("2021CS101");
        student.setName("Alice");
        student.setEmail("alice@mail.com");
        student.setAdmissionscheme("GEN");
        student.setOrcid(null);
        student.setAreaofresearch(null);
        student.setDateofjoin("2021-08-01");
        student.setGuide(guide);

        List<Student> mockStudents = List.of(student);
        when(excelHelper.excelToStudents(any())).thenReturn(mockStudents);
        when(guideRepository.findByEmail("john@nitc.ac.in")).thenReturn(Optional.of(guide));
        when(studentRepository.saveAll(any())).thenReturn(mockStudents);

        List<Student> saved = studentService.saveStudentsFromExcel(mockFile);

        assertEquals(1, saved.size());
        verify(studentRepository).saveAll(mockStudents);
    }

    @Test
    void saveStudentsFromExcel_invalidFileType_shouldThrowRuntimeException() {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getContentType()).thenReturn("text/plain");

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> studentService.saveStudentsFromExcel(mockFile));

        assertTrue(exception.getMessage().contains("Invalid Excel file format."));
    }


    @Test
    void saveStudentsFromExcel_emptyExcel_shouldReturnEmptyList() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getContentType()).thenReturn("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        when(mockFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(excelHelper.excelToStudents(any())).thenReturn(List.of());

        List<Student> saved = studentService.saveStudentsFromExcel(mockFile);

        assertTrue(saved.isEmpty());
        verify(studentRepository).saveAll(Collections.emptyList());
    }
}
