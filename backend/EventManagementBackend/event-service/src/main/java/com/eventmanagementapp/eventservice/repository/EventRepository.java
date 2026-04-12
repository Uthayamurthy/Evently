package com.eventmanagementapp.eventservice.repository;

import com.eventmanagementapp.eventservice.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
}