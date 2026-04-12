package com.eventmanagementapp.facultyservice.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String facultyId;
    private String facultyName;
    private String emailId;
    private String role;

    public LoginResponse(String token, String facultyId, String facultyName, String emailId, String role) {
        this.token = token;
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.emailId = emailId;
        this.role = role;
    }
}