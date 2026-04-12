package com.eventmanagementapp.eventservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String eventName;
    private String eventLocation;
    private String eventDate;
    private String eventDescription;
}