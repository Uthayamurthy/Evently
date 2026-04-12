package com.eventmanagementapp.studentservice.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String studentRollNumber;
    private String studentName;
    private String emailId;
    private String role;

    public LoginResponse(String token, String studentRollNumber, String studentName, String emailId, String role) {
        this.token = token;
        this.studentRollNumber = studentRollNumber;
        this.studentName = studentName;
        this.emailId = emailId;
        this.role = role;
    }
}