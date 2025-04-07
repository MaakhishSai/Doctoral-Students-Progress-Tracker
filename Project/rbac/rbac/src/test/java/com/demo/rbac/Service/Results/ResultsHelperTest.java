package com.demo.rbac.Service.Results;

import com.demo.rbac.service.Results.Resultshelper;
import com.demo.rbac.model.Results;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResultsHelperTest {

    @Test
    void testHasExcelFormat_validMimeTypeXLSX() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "results.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[0]
        );

        assertTrue(Resultshelper.hasExcelFormat(file));
    }

    @Test
    void testHasExcelFormat_invalidMimeType() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "text.txt",
                "text/plain",
                new byte[0]
        );

        assertFalse(Resultshelper.hasExcelFormat(file));
    }

    @Test
    void testExcelToResultss_parsesCorrectly() throws IOException {
        // Create Excel workbook in memory
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Results");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Roll No");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Core");
            header.createCell(3).setCellValue("Specialization");

            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue("P202300CS");
            row.createCell(1).setCellValue("Alice");
            row.createCell(2).setCellValue(85);
            row.createCell(3).setCellValue(90);

            workbook.write(out);
        }

        InputStream excelInput = new ByteArrayInputStream(out.toByteArray());
        List<Results> results = Resultshelper.excelToResultss(excelInput);

        assertEquals(1, results.size());
        Results r = results.get(0);
        assertEquals("P202300CS", r.getId());
        assertEquals("Alice", r.getName());
        assertEquals(85, r.getCore());
        assertEquals(90, r.getSpecialization());
    }

    @Test
    void testExcelToResultss_invalidNumber_shouldThrowException() throws IOException {
        // Create Excel with invalid number format
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Results");
            sheet.createRow(0).createCell(0).setCellValue("Header"); // Header

            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue("P202300CS");
            row.createCell(1).setCellValue("Bob");
            row.createCell(2).setCellValue("eighty"); // Invalid integer
            row.createCell(3).setCellValue("ninety"); // Invalid integer

            workbook.write(out);
        }

        InputStream excelInput = new ByteArrayInputStream(out.toByteArray());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            Resultshelper.excelToResultss(excelInput);
        });

        assertTrue(exception.getMessage().contains("Invalid number format"));
    }
}
