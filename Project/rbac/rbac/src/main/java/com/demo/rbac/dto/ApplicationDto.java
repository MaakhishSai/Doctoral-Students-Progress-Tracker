package com.demo.rbac.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApplicationDto {

    private Long examId;
    private String studentRollNo;
    private List<String> specializedSyllabi;
    private String status;

}
