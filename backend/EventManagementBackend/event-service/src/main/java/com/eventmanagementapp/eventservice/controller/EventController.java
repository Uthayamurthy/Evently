package com.eventmanagementapp.eventservice.controller;

import com.eventmanagementapp.eventservice.model.Event;
import com.eventmanagementapp.eventservice.model.ODRequest;
import com.eventmanagementapp.eventservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/verified")
    public ResponseEntity<List<Event>> getVerifiedEvents() {
        return ResponseEntity.ok(eventService.getAllVerifiedEvents());
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        Event saved = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}