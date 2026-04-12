package com.eventmanagementapp.studentservice.repository;

import com.eventmanagementapp.studentservice.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentRollNumber(String studentRollNumber);
    Optional<Student> findByEmailId(String emailId);
    boolean existsByStudentRollNumber(String studentRollNumber);
    boolean existsByEmailId(String emailId);
}