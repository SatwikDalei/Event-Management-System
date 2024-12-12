package com.eventmanagement.system.dto;

import java.time.LocalDateTime;
import java.util.List;

public class EventSearchDTO {
    private Long id;
    private String description;
    private String location;
    private LocalDateTime dateTime;
    private Boolean isPrivate;
    private String organizerEmail;
    private List<SearchTicketTypeDTO> ticketTypes;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Boolean getPrivate() {
        return isPrivate;
    }

    public void setPrivate(Boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public List<SearchTicketTypeDTO> getTicketTypes() {
        return ticketTypes;
    }

    public void setTicketTypes(List<SearchTicketTypeDTO> ticketTypes) {
        this.ticketTypes = ticketTypes;
    }
}
