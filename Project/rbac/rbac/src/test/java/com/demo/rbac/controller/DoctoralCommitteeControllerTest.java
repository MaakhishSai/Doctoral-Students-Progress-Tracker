package com.demo.rbac.controller;

import static org.mockito.Mockito.when;

import com.demo.rbac.model.CommitteeMember;
import com.demo.rbac.model.DoctoralCommittee;
import com.demo.rbac.repository.DoctoralCommitteeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {DoctoralCommitteeController.class})
@ExtendWith(SpringExtension.class)
@DisabledInAotMode
class DoctoralCommitteeControllerTest {
    @Autowired
    private DoctoralCommitteeController doctoralCommitteeController;

    @MockBean
    private DoctoralCommitteeRepository doctoralCommitteeRepository;

    /**
     * Test {@link DoctoralCommitteeController#getDoctoralCommittee(String)}.
     * <p>
     * Method under test: {@link DoctoralCommitteeController#getDoctoralCommittee(String)}
     */
    @Test
    @DisplayName("Test getDoctoralCommittee(String)")
    void testGetDoctoralCommittee() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/api/students/{studentId}/dc/get-dc",
                "42");

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"id\":null,\"studentId\":\"42\",\"dcChairName\":\"Dc Chair Name\",\"dcChairEmail\":\"jane.doe@example.org\","
                                        + "\"dcChairChanged\":true,\"phdSupervisorName\":\"Phd Supervisor Name\",\"phdSupervisorEmail\":\"jane.doe@example"
                                        + ".org\",\"phdSupervisorChanged\":true,\"members\":[]}"));
    }

    /**
     * Test {@link DoctoralCommitteeController#createDoctoralCommittee(String, DoctoralCommittee)}.
     * <p>
     * Method under test: {@link DoctoralCommitteeController#createDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test createDoctoralCommittee(String, DoctoralCommittee)")
    void testCreateDoctoralCommittee() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(new ArrayList<>());
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/api/students/{studentId}/dc/create-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("Doctoral Committee already exists for this student"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee)")
    void testUpdateDoctoralCommittee() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("john.smith@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        CommitteeMember committeeMember = new CommitteeMember();
        committeeMember.setEmail("jane.doe@example.org");
        committeeMember.setId(1L);
        committeeMember.setName("At least one DC member is required");

        ArrayList<CommitteeMember> members = new ArrayList<>();
        members.add(committeeMember);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(members);
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("PhD Supervisor can only be changed once"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee)")
    void testUpdateDoctoralCommittee2() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("john.smith@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        CommitteeMember committeeMember = new CommitteeMember();
        committeeMember.setEmail("jane.doe@example.org");
        committeeMember.setId(1L);
        committeeMember.setName("At least one DC member is required");

        ArrayList<CommitteeMember> members = new ArrayList<>();
        members.add(committeeMember);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(members);
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("DC Chair can only be changed once"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <ul>
     *   <li>Given {@link DoctoralCommittee} (default constructor) DcChairName is {@code jane.doe@example.org}.</li>
     * </ul>
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee); given DoctoralCommittee (default constructor) DcChairName is 'jane.doe@example.org'")
    void testUpdateDoctoralCommittee_givenDoctoralCommitteeDcChairNameIsJaneDoeExampleOrg() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("jane.doe@example.org");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        CommitteeMember committeeMember = new CommitteeMember();
        committeeMember.setEmail("jane.doe@example.org");
        committeeMember.setId(1L);
        committeeMember.setName("At least one DC member is required");

        ArrayList<CommitteeMember> members = new ArrayList<>();
        members.add(committeeMember);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(members);
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("DC Chair can only be changed once"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <ul>
     *   <li>Given {@link DoctoralCommittee} (default constructor) PhdSupervisorName is {@code Dc Chair Name}.</li>
     * </ul>
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee); given DoctoralCommittee (default constructor) PhdSupervisorName is 'Dc Chair Name'")
    void testUpdateDoctoralCommittee_givenDoctoralCommitteePhdSupervisorNameIsDcChairName() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Dc Chair Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        CommitteeMember committeeMember = new CommitteeMember();
        committeeMember.setEmail("jane.doe@example.org");
        committeeMember.setId(1L);
        committeeMember.setName("At least one DC member is required");

        ArrayList<CommitteeMember> members = new ArrayList<>();
        members.add(committeeMember);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(members);
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("PhD Supervisor can only be changed once"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <ul>
     *   <li>Then content string {@code At least one DC member is required}.</li>
     * </ul>
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee); then content string 'At least one DC member is required'")
    void testUpdateDoctoralCommittee_thenContentStringAtLeastOneDcMemberIsRequired() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee2);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=ISO-8859-1"))
                .andExpect(MockMvcResultMatchers.content().string("At least one DC member is required"));
    }

    /**
     * Test {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}.
     * <ul>
     *   <li>Then status {@link StatusResultMatchers#isOk()}.</li>
     * </ul>
     * <p>
     * Method under test: {@link DoctoralCommitteeController#updateDoctoralCommittee(String, DoctoralCommittee)}
     */
    @Test
    @DisplayName("Test updateDoctoralCommittee(String, DoctoralCommittee); then status isOk()")

    void testUpdateDoctoralCommittee_thenStatusIsOk() throws Exception {
        // Arrange
        DoctoralCommittee doctoralCommittee = new DoctoralCommittee();
        doctoralCommittee.setDcChairChanged(true);
        doctoralCommittee.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee.setDcChairName("Dc Chair Name");
        doctoralCommittee.setMembers(new ArrayList<>());
        doctoralCommittee.setPhdSupervisorChanged(true);
        doctoralCommittee.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee.setStudentId("42");

        DoctoralCommittee doctoralCommittee2 = new DoctoralCommittee();
        doctoralCommittee2.setDcChairChanged(true);
        doctoralCommittee2.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee2.setDcChairName("Dc Chair Name");
        doctoralCommittee2.setMembers(new ArrayList<>());
        doctoralCommittee2.setPhdSupervisorChanged(true);
        doctoralCommittee2.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee2.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee2.setStudentId("42");
        when(doctoralCommitteeRepository.save(Mockito.<DoctoralCommittee>any())).thenReturn(doctoralCommittee2);
        when(doctoralCommitteeRepository.findByStudentId(Mockito.<String>any())).thenReturn(doctoralCommittee);

        CommitteeMember committeeMember = new CommitteeMember();
        committeeMember.setEmail("jane.doe@example.org");
        committeeMember.setId(1L);
        committeeMember.setName("At least one DC member is required");

        ArrayList<CommitteeMember> members = new ArrayList<>();
        members.add(committeeMember);

        DoctoralCommittee doctoralCommittee3 = new DoctoralCommittee();
        doctoralCommittee3.setDcChairChanged(true);
        doctoralCommittee3.setDcChairEmail("jane.doe@example.org");
        doctoralCommittee3.setDcChairName("Dc Chair Name");
        doctoralCommittee3.setMembers(members);
        doctoralCommittee3.setPhdSupervisorChanged(true);
        doctoralCommittee3.setPhdSupervisorEmail("jane.doe@example.org");
        doctoralCommittee3.setPhdSupervisorName("Phd Supervisor Name");
        doctoralCommittee3.setStudentId("42");
        String content = (new ObjectMapper()).writeValueAsString(doctoralCommittee3);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .put("/api/students/{studentId}/dc/put-dc", "42")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        // Act and Assert
        MockMvcBuilders.standaloneSetup(doctoralCommitteeController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"id\":null,\"studentId\":\"42\",\"dcChairName\":\"Dc Chair Name\",\"dcChairEmail\":\"jane.doe@example.org\","
                                        + "\"dcChairChanged\":true,\"phdSupervisorName\":\"Phd Supervisor Name\",\"phdSupervisorEmail\":\"jane.doe@example"
                                        + ".org\",\"phdSupervisorChanged\":true,\"members\":[{\"id\":1,\"name\":\"At least one DC member is required\",\"email"
                                        + "\":\"jane.doe@example.org\"}]}"));
    }
}
