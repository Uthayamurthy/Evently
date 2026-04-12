package com.eventmanagementapp.eventservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "odrequests")
public class ODRequest {
    @Id
    private String id;
    private String studentName;
    private String studentRollNumber;
    private String eventName;
    private String eventLocation;
    private String eventDate;
    private String eventDescription;
    private String facultyId;
    private String status;
}