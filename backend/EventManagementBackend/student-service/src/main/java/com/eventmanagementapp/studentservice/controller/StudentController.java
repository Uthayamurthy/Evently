package com.eventmanagementapp.studentservice.controller;

import com.eventmanagementapp.studentservice.dto.LoginRequest;
import com.eventmanagementapp.studentservice.dto.LoginResponse;
import com.eventmanagementapp.studentservice.model.Student;
import com.eventmanagementapp.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {
        if (studentService.existsByRollNumber(student.getStudentRollNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Roll number already exists"));
        }
        if (studentService.existsByEmail(student.getEmailId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email already exists"));
        }

        Student saved = studentService.register(student);
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = studentService.login(loginRequest);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        }
        return ResponseEntity.ok(response);
    }
}