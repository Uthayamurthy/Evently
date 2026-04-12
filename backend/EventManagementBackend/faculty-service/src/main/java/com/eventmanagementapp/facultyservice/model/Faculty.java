package com.eventmanagementapp.facultyservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "faculties")
public class Faculty {
    @Id
    private String id;
    private String facultyName;
    private String facultyId;
    private String emailId;
    private String password;
    private String role = "FACULTY";
}