package com.demo.rbac.Service.Course;

import com.demo.rbac.model.Course;
import com.demo.rbac.service.Course.Coursehelper;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CoursehelperTest {

    @Test
    void testHasExcelFormat_validMimeType() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[10]);

        assertTrue(Coursehelper.hasExcelFormat(file));
    }

    @Test
    void testHasExcelFormat_invalidMimeType() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.txt",
                "text/plain",
                new byte[10]);

        assertFalse(Coursehelper.hasExcelFormat(file));
    }

    @Test
    void testExcelToCourses_validDepartmentRow_parsedSuccessfully() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Courses");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Dept");
        header.createCell(2).setCellValue("Course Name");
        header.createCell(3).setCellValue("SME Name");
        header.createCell(4).setCellValue("Institute");
        header.createCell(5).setCellValue("Co-Institute");
        header.createCell(6).setCellValue("Duration");
        header.createCell(7).setCellValue("TypeofCourse");
        header.createCell(8).setCellValue("Start Date");
        header.createCell(9).setCellValue("End Date");
        header.createCell(10).setCellValue("Exam Date");

        Row validRow = sheet.createRow(1);
        validRow.createCell(0).setCellValue("C123");
        validRow.createCell(1).setCellValue("Computer Science and Engineering");
        validRow.createCell(2).setCellValue("AI Basics");
        validRow.createCell(3).setCellValue("Dr. Smith");
        validRow.createCell(4).setCellValue("NITC");
        validRow.createCell(5).setCellValue("IITM");
        validRow.createCell(6).setCellValue("30 Days");
        validRow.createCell(7).setCellValue("Core");
        validRow.createCell(8).setCellValue("2023-08-01");
        validRow.createCell(9).setCellValue("2023-09-01");
        validRow.createCell(10).setCellValue("2023-09-10");

        workbook.write(out);
        workbook.close();

        ByteArrayInputStream input = new ByteArrayInputStream(out.toByteArray());

        List<Course> courses = Coursehelper.excelToCourses(input);

        assertEquals(1, courses.size());
        assertEquals("C123", courses.get(0).getId());
        assertEquals("Computer Science and Engineering", courses.get(0).getDept());
    }

    @Test
    void testExcelToCourses_wrongDepartmentRow_skipped() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Courses");

        Row header = sheet.createRow(0);
        for (int i = 0; i <= 10; i++) {
            header.createCell(i).setCellValue("Header" + i);
        }

        Row invalidRow = sheet.createRow(1);
        invalidRow.createCell(0).setCellValue("C124");
        invalidRow.createCell(1).setCellValue("Mechanical Engineering"); // Not CSE
        invalidRow.createCell(2).setCellValue("Robotics");

        workbook.write(out);
        workbook.close();

        ByteArrayInputStream input = new ByteArrayInputStream(out.toByteArray());

        List<Course> courses = Coursehelper.excelToCourses(input);

        assertTrue(courses.isEmpty(), "Courses list should be empty for non-CSE rows");
    }
}
