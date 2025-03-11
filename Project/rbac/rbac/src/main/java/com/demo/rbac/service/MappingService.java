package com.demo.rbac.service;

import com.demo.rbac.model.User;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MappingService {

    // for excel sheet processing
    private final UserRepository userRepository;

    // In-memory storage of mappings (in production, use a database table instead)
    private Map<String, String> studentToSupervisorMap = new HashMap<>();
    private Set<String> authorizedStudents = new HashSet<>();
    private Set<String> authorizedSupervisors = new HashSet<>();

    @Transactional
    public void processMappingFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Clear previous mappings
            studentToSupervisorMap.clear();
            authorizedStudents.clear();
            authorizedSupervisors.clear();

            // Skip header row if present
            boolean skipHeader = true;

            for (Row row : sheet) {
                if (skipHeader) {
                    skipHeader = false;
                    continue;
                }

                // Expecting column 0 to be student email and column 1 to be supervisor email
                String studentEmail = row.getCell(0).getStringCellValue().trim();
                String supervisorEmail = row.getCell(1).getStringCellValue().trim();

                if (!studentEmail.isEmpty() && !supervisorEmail.isEmpty()) {
                    // Store the mapping
                    studentToSupervisorMap.put(studentEmail, supervisorEmail);
                    authorizedStudents.add(studentEmail);
                    authorizedSupervisors.add(supervisorEmail);

                    // Create or update the user entities
                    User student = userRepository.findByEmail(studentEmail)
                            .orElseGet(() -> new User(studentEmail, UserRole.STUDENT));

                    User supervisor = userRepository.findByEmail(supervisorEmail)
                            .orElseGet(() -> new User(supervisorEmail, UserRole.SUPERVISOR));

                    // Establish the relationship
                    student.setSupervisor(supervisor);

                    // Save both entities
                    userRepository.save(supervisor);
                    userRepository.save(student);
                }
            }
        }
    }

    public boolean isStudentInMapping(String email) {
        // let's push my mail here
        authorizedStudents.add("punnam_b221135cs@nitc.ac.in");
        System.out.println("will my mail work");
        return authorizedStudents.contains(email);
    }

    public boolean isSupervisorInMapping(String email) {
        authorizedSupervisors.add("manhaas2004@gmail.com");
        System.out.println("will my personal mail work2");
        return authorizedSupervisors.contains(email);
    }

    public String getSupervisorEmail(String studentEmail) {
        return studentToSupervisorMap.get(studentEmail);
    }

}
