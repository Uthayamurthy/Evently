package com.eventmanagementapp.facultyservice.service;

import com.eventmanagementapp.facultyservice.dto.LoginRequest;
import com.eventmanagementapp.facultyservice.dto.LoginResponse;
import com.eventmanagementapp.facultyservice.model.Faculty;
import com.eventmanagementapp.facultyservice.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty register(Faculty faculty) {
        faculty.setRole("FACULTY");
        return facultyRepository.save(faculty);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<Faculty> facultyOpt = facultyRepository.findByEmailId(loginRequest.getEmailId());

        if (facultyOpt.isEmpty()) {
            return null;
        }

        Faculty faculty = facultyOpt.get();
        if (faculty.getPassword() == null || !faculty.getPassword().equals(loginRequest.getPassword())) {
            return null;
        }

        String token = generateToken(faculty);
        return new LoginResponse(
            token,
            faculty.getFacultyId(),
            faculty.getFacultyName(),
            faculty.getEmailId(),
            faculty.getRole()
        );
    }

    public Optional<Faculty> findByFacultyId(String facultyId) {
        return facultyRepository.findByFacultyId(facultyId);
    }

    public boolean existsByFacultyId(String facultyId) {
        return facultyRepository.existsByFacultyId(facultyId);
    }

    public boolean existsByEmail(String email) {
        return facultyRepository.existsByEmailId(email);
    }

    private String generateToken(Faculty faculty) {
        return UUID.randomUUID().toString();
    }
}
