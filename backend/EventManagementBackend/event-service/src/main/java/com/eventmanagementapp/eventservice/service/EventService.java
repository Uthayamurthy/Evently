package com.eventmanagementapp.eventservice.service;

import com.eventmanagementapp.eventservice.model.Event;
import com.eventmanagementapp.eventservice.model.ODRequest;
import com.eventmanagementapp.eventservice.repository.EventRepository;
import com.eventmanagementapp.eventservice.repository.ODRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ODRequestRepository odRequestRepository;

    public List<Event> getAllVerifiedEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public ODRequest applyOD(ODRequest odRequest) {
        odRequest.setStatus("PENDING");
        return odRequestRepository.save(odRequest);
    }

    public List<ODRequest> getPendingODs() {
        return odRequestRepository.findByStatus("PENDING");
    }

    public List<ODRequest> getPendingODsByFaculty(String facultyId) {
        // Return all pending ODs - faculty can see all pending ODs and approve any
        return odRequestRepository.findByStatus("PENDING");
    }

    public Optional<ODRequest> getODById(String id) {
        return odRequestRepository.findById(id);
    }

    public ODRequest approveOD(String id, String facultyId) {
        Optional<ODRequest> odOpt = odRequestRepository.findById(id);
        if (odOpt.isEmpty()) {
            return null;
        }

        ODRequest od = odOpt.get();
        od.setStatus("APPROVED");
        od.setFacultyId(facultyId);

        boolean isManualEntry = !isEventInMasterList(od);
        if (isManualEntry) {
            Event newEvent = new Event();
            newEvent.setEventName(od.getEventName());
            newEvent.setEventLocation(od.getEventLocation());
            newEvent.setEventDate(od.getEventDate());
            newEvent.setEventDescription(od.getEventDescription());
            eventRepository.save(newEvent);
        }

        return odRequestRepository.save(od);
    }

    public ODRequest rejectOD(String id, String facultyId) {
        Optional<ODRequest> odOpt = odRequestRepository.findById(id);
        if (odOpt.isEmpty()) {
            return null;
        }

        ODRequest od = odOpt.get();
        od.setStatus("REJECTED");
        return odRequestRepository.save(od);
    }

    public List<ODRequest> getODsByMonth(int year, int month) {
        List<ODRequest> allApproved = odRequestRepository.findByStatus("APPROVED");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return allApproved.stream()
            .filter(od -> {
                try {
                    LocalDate date = LocalDate.parse(od.getEventDate(), formatter);
                    return date.getYear() == year && date.getMonthValue() == month;
                } catch (Exception e) {
                    return false;
                }
            })
            .toList();
    }

    public List<ODRequest> getODsByStudentRollNumber(String rollNumber) {
        return odRequestRepository.findByStudentRollNumber(rollNumber);
    }

    public List<ODRequest> getAllODsByFaculty(String facultyId) {
        return odRequestRepository.findByFacultyId(facultyId);
    }

    private boolean isEventInMasterList(ODRequest od) {
        List<Event> events = eventRepository.findAll();
        return events.stream().anyMatch(e ->
            e.getEventName().equals(od.getEventName()) &&
            e.getEventDate().equals(od.getEventDate())
        );
    }
}