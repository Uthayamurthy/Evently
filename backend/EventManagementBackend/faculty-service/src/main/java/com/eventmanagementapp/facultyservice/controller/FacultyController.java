package com.eventmanagementapp.facultyservice.controller;

import com.eventmanagementapp.facultyservice.dto.LoginRequest;
import com.eventmanagementapp.facultyservice.dto.LoginResponse;
import com.eventmanagementapp.facultyservice.model.Faculty;
import com.eventmanagementapp.facultyservice.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Faculty faculty) {
        if (facultyService.existsByFacultyId(faculty.getFacultyId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Faculty ID already exists"));
        }
        if (facultyService.existsByEmail(faculty.getEmailId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email already exists"));
        }

        Faculty saved = facultyService.register(faculty);
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = facultyService.login(loginRequest);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        }
        return ResponseEntity.ok(response);
    }
}