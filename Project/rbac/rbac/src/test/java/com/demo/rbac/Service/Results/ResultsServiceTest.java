package com.demo.rbac.Service.Results;

import com.demo.rbac.model.Results;
import com.demo.rbac.service.Results.ResultsService;
import com.demo.rbac.repository.ResultsRepository;
import com.demo.rbac.service.Results.Resultshelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResultsServiceTest {

    @Mock
    private ResultsRepository resultsRepository;

    @InjectMocks
    private ResultsService resultsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test: Valid Excel File
    @Test
    void testSaveResultssFromExcel_Success() throws Exception {
        // Create fake Excel file content
        String content = "id,Name,Core,Specialization\nP202300CS,John,3,2";
        MockMultipartFile file = new MockMultipartFile("file", "results.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content.getBytes());

        // Mock helper behavior
        try (MockedStatic<Resultshelper> mockedHelper = mockStatic(Resultshelper.class)) {
            mockedHelper.when(() -> Resultshelper.hasExcelFormat(file)).thenReturn(true);

            Results mockResult = new Results("P202300CS", "John", 3, 2);
            mockedHelper.when(() -> Resultshelper.excelToResultss(any())).thenReturn(List.of(mockResult));

            when(resultsRepository.saveAll(anyList())).thenReturn(List.of(mockResult));

            List<Results> result = resultsService.saveResultssFromExcel(file);

            assertEquals(1, result.size());
            assertEquals("John", result.get(0).getName());
        }
    }

    // Test: Invalid Excel format
    @Test
    void testSaveResultssFromExcel_InvalidFormat() {
        MockMultipartFile file = new MockMultipartFile("file", "not-excel.txt", "text/plain", "bad content".getBytes());

        try (MockedStatic<Resultshelper> mockedHelper = mockStatic(Resultshelper.class)) {
            mockedHelper.when(() -> Resultshelper.hasExcelFormat(file)).thenReturn(false);

            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    resultsService.saveResultssFromExcel(file)
            );
            assertEquals("Error processing Excel file: " + "Invalid Excel file format.", exception.getMessage());
        }
    }

    //  Edge Case: Excel file with no valid results
    @Test
    void testSaveResultssFromExcel_EmptyList() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "empty.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new byte[0]);

        try (MockedStatic<Resultshelper> mockedHelper = mockStatic(Resultshelper.class)) {
            mockedHelper.when(() -> Resultshelper.hasExcelFormat(file)).thenReturn(true);
            mockedHelper.when(() -> Resultshelper.excelToResultss(any())).thenReturn(Collections.emptyList());

            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    resultsService.saveResultssFromExcel(file)
            );
            assertTrue(exception.getMessage().contains("No valid Resultss"));
        }
    }
}