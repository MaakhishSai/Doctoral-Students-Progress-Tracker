package com.demo.rbac.Service.Results;

import com.demo.rbac.model.Results;
import com.demo.rbac.repository.ResultsRepository;
import org.apache.poi.ss.usermodel.*;
import com.demo.rbac.service.Results.ResultsService;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResultsServiceTest {

    @InjectMocks
    private ResultsService resultsService;

    @Mock
    private ResultsRepository resultsRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Correct Case
    @Test
    void testSaveResultsFromExcel_validFile_savesSuccessfully() throws Exception {
        // Create in-memory Excel file
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Results");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Roll No");
        header.createCell(1).setCellValue("Subject");
        header.createCell(2).setCellValue("Grade");

        Row data = sheet.createRow(1);
        data.createCell(0).setCellValue("CS101");
        data.createCell(1).setCellValue("Algorithms");
        data.createCell(2).setCellValue("A");

        workbook.write(out);
        workbook.close();

        MockMultipartFile file = new MockMultipartFile(
                "file", "results.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new ByteArrayInputStream(out.toByteArray())
        );

        when(resultsRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        List<Results> savedResults = resultsService.saveResultssFromExcel(file);

        assertEquals(1, savedResults.size());
        assertEquals("CS101", savedResults.get(0).getId());
    }

    // Wrong Case (invalid MIME type)
    @Test
    void testSaveResultsFromExcel_invalidFileType_throwsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "not_excel.txt", "text/plain", "Invalid content".getBytes()
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> resultsService.saveResultssFromExcel(file)
        );

        assertEquals("Invalid Excel file format.", exception.getMessage());
    }

    // ⚠️ Edge Case (valid Excel file with no data)
    @Test
    void testSaveResultsFromExcel_emptyExcel_throwsRuntimeException() throws Exception {
        // Excel file with only headers
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Results");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Roll No");
        header.createCell(1).setCellValue("Subject");
        header.createCell(2).setCellValue("Grade");

        workbook.write(out);
        workbook.close();

        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new ByteArrayInputStream(out.toByteArray())
        );

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> resultsService.saveResultssFromExcel(file)
        );

        assertEquals("No valid Resultss found in the uploaded file.", exception.getMessage());
    }
}
