package com.eventmanagement.system.dto;

import java.util.List;

public class EventDashboardDTO {
    private Long eventId;
    private String eventName;
    private String location;
    private String dateTime;
    private List<TicketTypeSummary> ticketTypeSummaries;
    private int totalAttendees;
    private double totalRevenue;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<TicketTypeSummary> getTicketTypeSummaries() {
        return ticketTypeSummaries;
    }

    public void setTicketTypeSummaries(List<TicketTypeSummary> ticketTypeSummaries) {
        this.ticketTypeSummaries = ticketTypeSummaries;
    }

    public int getTotalAttendees() {
        return totalAttendees;
    }

    public void setTotalAttendees(int totalAttendees) {
        this.totalAttendees = totalAttendees;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public static class TicketTypeSummary {
        private String ticketType;
        private int ticketsSold;
        private int ticketsRemaining;
        private double revenue;

        public String getTicketType() {
            return ticketType;
        }

        public void setTicketType(String ticketType) {
            this.ticketType = ticketType;
        }

        public int getTicketsSold() {
            return ticketsSold;
        }

        public void setTicketsSold(int ticketsSold) {
            this.ticketsSold = ticketsSold;
        }

        public int getTicketsRemaining() {
            return ticketsRemaining;
        }

        public void setTicketsRemaining(int ticketsRemaining) {
            this.ticketsRemaining = ticketsRemaining;
        }

        public double getRevenue() {
            return revenue;
        }

        public void setRevenue(double revenue) {
            this.revenue = revenue;
        }
    }
}
