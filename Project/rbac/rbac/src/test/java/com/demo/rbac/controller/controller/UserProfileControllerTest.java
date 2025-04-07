package com.demo.rbac.controller.controller;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.demo.rbac.controller.UserProfileController;
import com.demo.rbac.model.Guide;
import com.demo.rbac.model.Student;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.service.student.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {UserProfileController.class})
@ExtendWith(SpringExtension.class)
@DisabledInAotMode
class UserProfileControllerTest {
    @MockBean
    private StudentService studentService;

    @Autowired
    private UserProfileController userProfileController;

    /**
     * Test {@link UserProfileController#getProfile(OAuth2User)}.
     * <ul>
     *   <li>When {@code null}.</li>
     *   <li>Then throw {@link RuntimeException}.</li>
     * </ul>
     * <p>
     * Method under test: {@link UserProfileController#getProfile(OAuth2User)}
     */
    @Test
    @DisplayName("Test getProfile(OAuth2User); when 'null'; then throw RuntimeException")
    void testGetProfile_whenNull_thenThrowRuntimeException() {
        //   Diffblue Cover was unable to create a Spring-specific test for this Spring method.
        //   Run dcover create --keep-partial-tests to gain insights into why
        //   a non-Spring test was created.

        // Arrange, Act and Assert
        assertThrows(RuntimeException.class, () -> (new UserProfileController()).getProfile(null));
    }

    /**
     * Test {@link UserProfileController#updateProfile(Student)}.
     * <ul>
     *   <li>Given {@link StudentService} {@link StudentService#findByEmail(String)} return empty.</li>
     *   <li>Then status {@link StatusResultMatchers#isNotFound()}.</li>
     * </ul>
     * <p>
     * Method under test: {@link UserProfileController#updateProfile(Student)}
     */
    @Test
    @DisplayName("Test updateProfile(Student); given StudentService findByEmail(String) return empty; then status isNotFound()")
    void testUpdateProfile_givenStudentServiceFindByEmailReturnEmpty_thenStatusIsNotFound() throws Exception {
        // Arrange
        Guide guide = new Guide();
        guide.setEmail("jane.doe@example.org");
        guide.setId(1L);
        guide.setName("Name");
        guide.setStudents(new ArrayList<>());
        guide.setUserRole(UserRole.STUDENT);

        Student student = new Student();
        student.setAdmissionscheme("Admissionscheme");
        student.setAreaofresearch("Areaofresearch");
        student.setDateofjoin("2020-03-01");
        student.setEmail("jane.doe@example.org");
        student.setGuide(guide);
        student.setName("Name");
        student.setOrcid("Orcid");
        student.setRoll("Roll");
        student.setUserRole(UserRole.STUDENT);
        when(studentService.saveStudent(Mockito.<Student>any())).thenReturn(student);
        Optional<Student> emptyResult = Optional.empty();
        when(studentService.findByEmail(Mockito.<String>any())).thenReturn(emptyResult);

        Guide guide2 = new Guide();
        guide2.setEmail("jane.doe@example.org");
        guide2.setId(1L);
        guide2.setName("Name");
        guide2.setStudents(new ArrayList<>());
        guide2.setUserRole(UserRole.STUDENT);

        Student student2 = new Student();
        student2.setAdmissionscheme("Admissionscheme");
        student2.setAreaofresearch("Areaofresearch");
        student2.setDateofjoin("2020-03-01");
        student2.setEmail("jane.doe@example.org");
        student2.setGuide(guide2);
        student2.setName("Name");
        student2.setOrcid("Orcid");
        student2.setRoll("Roll");
        student2.setUserRole(UserRole.STUDENT);
        String content = (new ObjectMapper()).writeValueAsString(student2);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.put("/api/user/update-profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(userProfileController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("Student not found."));
    }

    /**
     * Test {@link UserProfileController#updateProfile(Student)}.
     * <ul>
     *   <li>Then status {@link StatusResultMatchers#isOk()}.</li>
     * </ul>
     * <p>
     * Method under test: {@link UserProfileController#updateProfile(Student)}
     */
    @Test
    @DisplayName("Test updateProfile(Student); then status isOk()")
    void testUpdateProfile_thenStatusIsOk() throws Exception {
        // Arrange
        Guide guide = new Guide();
        guide.setEmail("jane.doe@example.org");
        guide.setId(1L);
        guide.setName("Name");
        guide.setStudents(new ArrayList<>());
        guide.setUserRole(UserRole.STUDENT);

        Student student = new Student();
        student.setAdmissionscheme("Admissionscheme");
        student.setAreaofresearch("Areaofresearch");
        student.setDateofjoin("2020-03-01");
        student.setEmail("jane.doe@example.org");
        student.setGuide(guide);
        student.setName("Name");
        student.setOrcid("Orcid");
        student.setRoll("Roll");
        student.setUserRole(UserRole.STUDENT);
        Optional<Student> ofResult = Optional.of(student);

        Guide guide2 = new Guide();
        guide2.setEmail("jane.doe@example.org");
        guide2.setId(1L);
        guide2.setName("Name");
        guide2.setStudents(new ArrayList<>());
        guide2.setUserRole(UserRole.STUDENT);

        Student student2 = new Student();
        student2.setAdmissionscheme("Admissionscheme");
        student2.setAreaofresearch("Areaofresearch");
        student2.setDateofjoin("2020-03-01");
        student2.setEmail("jane.doe@example.org");
        student2.setGuide(guide2);
        student2.setName("Name");
        student2.setOrcid("Orcid");
        student2.setRoll("Roll");
        student2.setUserRole(UserRole.STUDENT);
        when(studentService.saveStudent(Mockito.<Student>any())).thenReturn(student2);
        when(studentService.findByEmail(Mockito.<String>any())).thenReturn(ofResult);

        Guide guide3 = new Guide();
        guide3.setEmail("jane.doe@example.org");
        guide3.setId(1L);
        guide3.setName("Name");
        guide3.setStudents(new ArrayList<>());
        guide3.setUserRole(UserRole.STUDENT);

        Student student3 = new Student();
        student3.setAdmissionscheme("Admissionscheme");
        student3.setAreaofresearch("Areaofresearch");
        student3.setDateofjoin("2020-03-01");
        student3.setEmail("jane.doe@example.org");
        student3.setGuide(guide3);
        student3.setName("Name");
        student3.setOrcid("Orcid");
        student3.setRoll("Roll");
        student3.setUserRole(UserRole.STUDENT);
        String content = (new ObjectMapper()).writeValueAsString(student3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.put("/api/user/update-profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(userProfileController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("Profile updated successfully."));
    }
}
