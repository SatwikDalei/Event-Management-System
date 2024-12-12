package com.eventmanagement.system.service;

import com.eventmanagement.system.dto.EventDashboardDTO;
import com.eventmanagement.system.dto.EventDashboardDTO.TicketTypeSummary;
import com.eventmanagement.system.model.Event;
import com.eventmanagement.system.model.TicketType;
import com.eventmanagement.system.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrganizerService {

    @Autowired
    private EventRepository eventRepository;

    public List<EventDashboardDTO> getOrganizerDashboard(String organizerEmail) {
        List<Event> events = eventRepository.findByOrganizerEmail(organizerEmail);
        List<EventDashboardDTO> dashboardData = new ArrayList<>();

        for (Event event : events) {
            EventDashboardDTO dto = new EventDashboardDTO();
            dto.setEventId(event.getId());
            dto.setEventName(event.getDescription());
            dto.setLocation(event.getLocation());
            dto.setDateTime(event.getDateTime().toString());

            List<EventDashboardDTO.TicketTypeSummary> ticketSummaries = new ArrayList<>();
            int totalAttendees = 0; // Total attendees for this event
            double totalRevenue = 0;

            for (TicketType ticket : event.getTicketTypes()) {
                EventDashboardDTO.TicketTypeSummary summary = new EventDashboardDTO.TicketTypeSummary();
                summary.setTicketType(ticket.getName());
                summary.setTicketsSold(ticket.getQuantitySold());
                summary.setTicketsRemaining(ticket.getQuantityAvailable());
                double revenue = ticket.getQuantitySold() * ticket.getPrice();
                summary.setRevenue(revenue);
                totalRevenue += revenue;

                totalAttendees += ticket.getQuantitySold(); // Accumulate attendees

                ticketSummaries.add(summary);
            }

            dto.setTicketTypeSummaries(ticketSummaries);
            dto.setTotalAttendees(totalAttendees); // Correct total attendees
            dto.setTotalRevenue(totalRevenue); // Total revenue for the event

            dashboardData.add(dto);
        }
        return dashboardData;
    }
}

