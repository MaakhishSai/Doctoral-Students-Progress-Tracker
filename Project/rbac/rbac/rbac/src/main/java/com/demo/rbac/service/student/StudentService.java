package com.demo.rbac.service.student;

import com.demo.rbac.dto.StudentGuideDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.demo.rbac.model.Student;
import com.demo.rbac.model.Guide;
import com.demo.rbac.repository.StudentRepository;
import com.demo.rbac.repository.GuideRepository;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private GuideRepository guideRepository;

    @Autowired
    private ExcelHelper excelHelper; // Inject ExcelHelper

    public List<Student> saveStudentsFromExcel(MultipartFile file) {
        try {
            if (!ExcelHelper.hasExcelFormat(file)) {
                throw new RuntimeException("Invalid Excel file format.");
            }

            InputStream inputStream = file.getInputStream();
            List<Student> students = excelHelper.excelToStudents(inputStream); // Use instance method

            for (Student student : students) {
                Guide tempGuide = student.getGuide();

                // Check if guide info is provided
                if (tempGuide != null && tempGuide.getEmail() != null) {
                    Optional<Guide> existingGuide = guideRepository.findByEmail(tempGuide.getEmail());

                    Guide savedGuide = existingGuide.orElseGet(() -> {
                        Guide newGuide = new Guide();
                        newGuide.setName(tempGuide.getName());
                        newGuide.setEmail(tempGuide.getEmail());
                        return guideRepository.save(newGuide); // Save new guide
                    });

                    // Ensure the name is always updated
                    if (!existingGuide.isEmpty() && tempGuide.getName() != null) {
                        savedGuide.setName(tempGuide.getName());
                        guideRepository.save(savedGuide);
                    }

                    student.setGuide(savedGuide); // Associate student with guide
                } else {
                    student.setGuide(null); // Handle students with no guide
                }
            }

            return studentRepository.saveAll(students);  // Save students with correct guide
        } catch (Exception e) {
            throw new RuntimeException("Error saving students: " + e.getMessage());
        }
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<StudentGuideDTO> getAllStudentsWithGuides() {
        return studentRepository.findAllWithGuides(); // Fetch students along with guides
    }

    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student saveStudent(Student student){
        return studentRepository.save(student);
    }

    public Optional<Student> getStudentByRollNumber(String rollNumber) {
        return studentRepository.findById(rollNumber);
    }

    // ✅ NEW METHOD: Update student details
    public Student updateStudent(Student student) {
        return studentRepository.save(student); // Save updated student details
    }
}
