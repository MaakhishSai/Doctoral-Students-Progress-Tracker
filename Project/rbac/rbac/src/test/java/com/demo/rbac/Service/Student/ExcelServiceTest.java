package com.demo.rbac.Service.Student;

import com.demo.rbac.model.Student;
import com.demo.rbac.service.student.ExcelHelper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ExcelHelperTest {

    private final ExcelHelper excelHelper = new ExcelHelper(null);

    // ✅ CORRECT TEST
    @Test
    void testExcelToStudents_validExcel_returnsStudentsList() throws Exception {
        // Create a sample Excel file in-memory
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Students");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Roll");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Admission Scheme");
        header.createCell(4).setCellValue("Guide Name");
        header.createCell(5).setCellValue("Guide Email");
        header.createCell(6).setCellValue("Date of Join");

        Row row = sheet.createRow(1);
        row.createCell(0).setCellValue("PH21CS001");
        row.createCell(1).setCellValue("Alice");
        row.createCell(2).setCellValue("alice@nitc.ac.in");
        row.createCell(3).setCellValue("direct");
        row.createCell(4).setCellValue("Dr. Bob");
        row.createCell(5).setCellValue("bob@nitc.ac.in");
        row.createCell(6).setCellValue("2021-08-01");

        workbook.write(out);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(out.toByteArray());

        List<Student> students = excelHelper.excelToStudents(inputStream);

        assertEquals(1, students.size());
        Student student = students.get(0);
        assertEquals("PH21CS001", student.getRoll());
        assertEquals("Alice", student.getName());
        assertEquals("bob@nitc.ac.in", student.getGuide().getEmail());
        assertEquals("2021-08-01", student.getDateofjoin());
    }

    // WRONG TEST
    @Test
    void testExcelToStudents_malformedInput_throwsException() {
        ByteArrayInputStream brokenStream = new ByteArrayInputStream("not-an-excel-file".getBytes());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                excelHelper.excelToStudents(brokenStream)
        );
        System.out.println("Actual message: " + exception.getMessage());
        assertTrue(exception.getMessage().contains("Error processing Excel file"));
    }

    // EDGE CASE
    @Test
    void testExcelToStudents_onlyHeader_returnsEmptyList() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Students");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Roll");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Admission Scheme");
        header.createCell(4).setCellValue("Guide Name");
        header.createCell(5).setCellValue("Guide Email");
        header.createCell(6).setCellValue("Date of Join");

        workbook.write(out);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(out.toByteArray());

        List<Student> students = excelHelper.excelToStudents(inputStream);
        assertTrue(students.isEmpty());
    }

    // ✅ BONUS: hasExcelFormat check
    @Test
    void testHasExcelFormat_validFile_returnsTrue() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "students.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new byte[0]
        );
        assertTrue(ExcelHelper.hasExcelFormat(file));
    }

    @Test
    void testHasExcelFormat_invalidFile_returnsFalse() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "students.txt", "text/plain", new byte[0]
        );
        assertFalse(ExcelHelper.hasExcelFormat(file));
    }
}
