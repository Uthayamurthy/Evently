package com.eventmanagementapp.eventservice.controller;

import com.eventmanagementapp.eventservice.model.ODRequest;
import com.eventmanagementapp.eventservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/od")
public class ODController {

    @Autowired
    private EventService eventService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyOD(@RequestBody ODRequest odRequest,
                                     @RequestHeader(value = "X-User-Email", required = false) String userEmail,
                                     @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        odRequest.setStatus("PENDING");
        ODRequest saved = eventService.applyOD(odRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ODRequest>> getPendingODs(
            @RequestHeader(value = "X-User-Id", required = false) String facultyId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        List<ODRequest> pending;
        if ("FACULTY".equals(userRole)) {
            pending = eventService.getPendingODsByFaculty(facultyId);
        } else {
            pending = eventService.getPendingODs();
        }
        return ResponseEntity.ok(pending);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveOD(@PathVariable String id,
                                       @RequestHeader(value = "X-User-Id", required = false) String facultyId,
                                       @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (!"FACULTY".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Only faculty can approve ODs"));
        }

        Optional<ODRequest> odOpt = eventService.getODById(id);
        if (odOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "OD request not found"));
        }

        ODRequest od = odOpt.get();
        if (od.getFacultyId() != null && !od.getFacultyId().equals(facultyId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "You can only approve ODs assigned to you"));
        }

        ODRequest approved = eventService.approveOD(id, facultyId);
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectOD(@PathVariable String id,
                                     @RequestHeader(value = "X-User-Id", required = false) String facultyId,
                                     @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        if (!"FACULTY".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Only faculty can reject ODs"));
        }

        Optional<ODRequest> odOpt = eventService.getODById(id);
        if (odOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "OD request not found"));
        }

        ODRequest rejected = eventService.rejectOD(id, facultyId);
        return ResponseEntity.ok(rejected);
    }

    @GetMapping("/by-month")
    public ResponseEntity<List<ODRequest>> getODsByMonth(
            @RequestParam int year,
            @RequestParam int month,
            @RequestHeader(value = "X-User-Id", required = false) String facultyId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        List<ODRequest> ods = eventService.getODsByMonth(year, month);
        if ("FACULTY".equals(userRole) && facultyId != null) {
            ods = ods.stream()
                .filter(od -> facultyId.equals(od.getFacultyId()))
                .toList();
        }
        return ResponseEntity.ok(ods);
    }

    @GetMapping("/my-ods")
    public ResponseEntity<List<ODRequest>> getMyODs(
            @RequestHeader(value = "X-User-Id", required = false) String studentRollNumber,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        List<ODRequest> ods = eventService.getODsByStudentRollNumber(studentRollNumber);
        return ResponseEntity.ok(ods);
    }
}