package com.eventmanagementapp.facultyservice.repository;

import com.eventmanagementapp.facultyservice.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Optional<Faculty> findByFacultyId(String facultyId);
    Optional<Faculty> findByEmailId(String emailId);
    boolean existsByFacultyId(String facultyId);
    boolean existsByEmailId(String emailId);
}