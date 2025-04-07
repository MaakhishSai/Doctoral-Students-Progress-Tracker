package com.demo.rbac.Service.Course;

import com.demo.rbac.service.Course.CourseService;
import com.demo.rbac.model.Course;
import com.demo.rbac.repository.CourseRepository;
import com.demo.rbac.service.Course.Coursehelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveCoursesFromExcel_ShouldReturnSavedCourses() throws Exception {
        // Arrange
        MultipartFile file = mock(MultipartFile.class);
        List<Course> mockCourses = List.of(
                new Course("C1", "CSE", "AI", "Dr. A", "IIT", "", "4 weeks", "Online", "2024-01-01", "2024-02-01", "2024-02-05")
        );

        when(file.getContentType()).thenReturn("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        InputStream mockInput = new ByteArrayInputStream(new byte[]{});
        when(file.getInputStream()).thenReturn(mockInput);

        // Mock static method using Mockito
        try (MockedStatic<Coursehelper> mockedStatic = mockStatic(Coursehelper.class)) {
            mockedStatic.when(() -> Coursehelper.hasExcelFormat(file)).thenReturn(true);
            mockedStatic.when(() -> Coursehelper.excelToCourses(mockInput)).thenReturn(mockCourses);
            when(courseRepository.saveAll(mockCourses)).thenReturn(mockCourses);

            // Act
            List<Course> savedCourses = courseService.saveCoursesFromExcel(file);

            // Assert
            assertEquals(1, savedCourses.size());
            assertEquals("C1", savedCourses.get(0).getId());
            verify(courseRepository, times(1)).saveAll(mockCourses);
        }
    }

    @Test
    void saveCoursesFromExcel_ShouldThrowErrorForInvalidFormat() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getContentType()).thenReturn("text/plain");

        try (MockedStatic<Coursehelper> mockedStatic = mockStatic(Coursehelper.class)) {
            mockedStatic.when(() -> Coursehelper.hasExcelFormat(file)).thenReturn(false);
            assertThrows(RuntimeException.class, () -> courseService.saveCoursesFromExcel(file));
        }
    }

    @Test
    void saveCoursesFromExcel_ShouldThrowErrorIfNoCoursesParsed() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        InputStream mockInput = new ByteArrayInputStream(new byte[]{});

        when(file.getContentType()).thenReturn("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        when(file.getInputStream()).thenReturn(mockInput);

        try (MockedStatic<Coursehelper> mockedStatic = mockStatic(Coursehelper.class)) {
            mockedStatic.when(() -> Coursehelper.hasExcelFormat(file)).thenReturn(true);
            mockedStatic.when(() -> Coursehelper.excelToCourses(mockInput)).thenReturn(Collections.emptyList());

            RuntimeException exception = assertThrows(RuntimeException.class, () -> courseService.saveCoursesFromExcel(file));
            assertTrue(exception.getMessage().contains("No valid courses"));
        }
    }

    @Test
    void getAllCourses_ShouldReturnCourses() {
        List<Course> mockList = List.of(new Course(), new Course());
        when(courseRepository.findAll()).thenReturn(mockList);

        List<Course> result = courseService.getAllCourses();
        assertEquals(2, result.size());
    }

    @Test
    void getAllCourses_ShouldThrowIfEmpty() {
        when(courseRepository.findAll()).thenReturn(Collections.emptyList());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> courseService.getAllCourses());
        assertEquals("No courses found in the database.", ex.getMessage());
    }
}
