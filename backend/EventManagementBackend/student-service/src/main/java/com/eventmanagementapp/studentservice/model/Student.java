package com.eventmanagementapp.studentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String studentName;
    private String studentRollNumber;
    private String emailId;
    private String password;
    private String role = "STUDENT";
}