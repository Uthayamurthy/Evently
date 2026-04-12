package com.eventmanagementapp.studentservice.service;

import com.eventmanagementapp.studentservice.dto.LoginRequest;
import com.eventmanagementapp.studentservice.dto.LoginResponse;
import com.eventmanagementapp.studentservice.model.Student;
import com.eventmanagementapp.studentservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student register(Student student) {
        student.setRole("STUDENT");
        return studentRepository.save(student);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<Student> studentOpt = studentRepository.findByEmailId(loginRequest.getEmailId());

        if (studentOpt.isEmpty()) {
            return null;
        }

        Student student = studentOpt.get();
        if (student.getPassword() == null || !student.getPassword().equals(loginRequest.getPassword())) {
            return null;
        }

        String token = generateToken(student);
        return new LoginResponse(
            token,
            student.getStudentRollNumber(),
            student.getStudentName(),
            student.getEmailId(),
            student.getRole()
        );
    }

    public Optional<Student> findByRollNumber(String rollNumber) {
        return studentRepository.findByStudentRollNumber(rollNumber);
    }

    public boolean existsByRollNumber(String rollNumber) {
        return studentRepository.existsByStudentRollNumber(rollNumber);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmailId(email);
    }

    private String generateToken(Student student) {
        return UUID.randomUUID().toString();
    }
}
