package com.eventmanagementapp.eventservice.repository;

import com.eventmanagementapp.eventservice.model.ODRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ODRequestRepository extends MongoRepository<ODRequest, String> {
    List<ODRequest> findByStatus(String status);
    List<ODRequest> findByStudentRollNumber(String studentRollNumber);
    List<ODRequest> findByFacultyId(String facultyId);
}