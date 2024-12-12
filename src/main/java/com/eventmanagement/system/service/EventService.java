package com.eventmanagement.system.service;

import com.eventmanagement.system.dto.*;
import com.eventmanagement.system.model.Event;
import com.eventmanagement.system.model.TicketType;
import com.eventmanagement.system.model.User;
import com.eventmanagement.system.repository.EventRepository;
import com.eventmanagement.system.repository.TicketTypeRepository;
import com.eventmanagement.system.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private EntityManager entityManager;
   



    private boolean isEventDuplicate(Event event) {
        return eventRepository.existsByDescriptionAndLocation(event.getDescription(), event.getLocation());
    }



    // Add this method in EventService
    public EventSearchDTO mapToEventSearchDTO(Event event) {
        EventSearchDTO dto = new EventSearchDTO();
        dto.setId(event.getId());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setDateTime(event.getDateTime());
        dto.setPrivate(event.isPrivate());
        dto.setOrganizerEmail(event.getOrganizerEmail());

        // Map ticket types specifically for search
        List<SearchTicketTypeDTO> ticketTypeDTOs = event.getTicketTypes().stream()
                .map(ticketType -> {
                    SearchTicketTypeDTO searchTicketTypeDTO = new SearchTicketTypeDTO();
                    searchTicketTypeDTO.setName(ticketType.getName());
                    searchTicketTypeDTO.setPrice(ticketType.getPrice());
                    searchTicketTypeDTO.setQuantityAvailable(ticketType.getQuantityAvailable());
                    return searchTicketTypeDTO;
                })
                .toList();
        dto.setTicketTypes(ticketTypeDTOs);

        return dto;
    }




    public List<EventSearchDTO> searchEvents(String description, String location) {
        List<Event> events;
        if (description != null && location != null) {
            events = eventRepository.findByDescriptionContainingIgnoreCase(description)
                    .stream()
                    .filter(event -> event.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .toList();
        } else if (description != null) {
            events = eventRepository.findByDescriptionContainingIgnoreCase(description);
        } else if (location != null) {
            events = eventRepository.findByLocationContainingIgnoreCase(location);
        } else {
            events = eventRepository.findAll();
        }
        return events.stream().map(this::mapToEventSearchDTO).toList();
    }

    @Transactional
    public Optional<Event> createEvent(Event event) {

        entityManager.clear();

        // Check for duplicate event
        if (eventRepository.existsByDescriptionAndLocation(event.getDescription(), event.getLocation())) {
            return Optional.empty();
        }
        event.getTicketTypes().forEach(ticketType -> {
            if (ticketType.getQuantitySold() == null) {
                ticketType.setQuantitySold(0); // Set quantitySold to 0 if it's null
            }
            ticketType.setEvent(event); // Set event for ticket types
        });
        Event savedEvent = eventRepository.save(event); // Save event along with ticket types
        return Optional.of(savedEvent);
    }


    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {  // Check if the event exists
            eventRepository.deleteById(id);  // Delete event by ID
            return true;
        }
        return false;  // If event does not exist, return false
    }


    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null); // Return event if found, else null
    }

    public Event updateEvent(Long id, String description, String location, String dateTime,Boolean isPrivate) {
        Optional<Event> existingEventOpt = eventRepository.findById(id);
        if (existingEventOpt.isEmpty()) {
            return null;
        }

        Event existingEvent = existingEventOpt.get();
        if (description != null) existingEvent.setDescription(description);
        if (location != null) existingEvent.setLocation(location);
        if (dateTime != null) {
            try {
                existingEvent.setDateTime(LocalDateTime.parse(dateTime));
            } catch (Exception e) {
                return null; // Handle invalid date in the controller
            }
        }

        if (isPrivate != null) existingEvent.setPrivate(isPrivate);

        return eventRepository.save(existingEvent);
    }




    public String registerForEvent(Long eventId,String userName, String ticketTypeName, int quantity) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        Optional<User> userOptional = userRepository.findByName(userName);

        if (eventOptional.isEmpty()) {
            return "Event not found.";
        }
        if (userOptional.isEmpty()) {
            return "User not found.";
        }

        Event event = eventOptional.get();

        // Fetch ticket type by name and event ID
        TicketType ticketType = ticketTypeRepository.findByNameAndEventId(ticketTypeName, eventId);

        if (ticketType == null) {
            return "Ticket type not found for the selected event.";
        }

        User user = userOptional.get();

        // Check ticket availability
        if (ticketType.getQuantityAvailable() < quantity) {
            return "Not enough tickets available.";
        }

        // Deduct tickets and update entities
        ticketType.setQuantityAvailable(ticketType.getQuantityAvailable() - quantity);
        ticketType.setQuantitySold(ticketType.getQuantitySold() + quantity);

        event.getAttendees().add(user);
        eventRepository.save(event);
        ticketTypeRepository.save(ticketType);

        return "User registered for the event successfully.";
    }
    public List<Event> getEventsForUserByEmail(String email) {
        // Use the existing findByEmail method
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found with the provided email.");
        }

        // Assuming the `eventRepository` has a method to fetch events by user ID
        return eventRepository.findEventsByUserId(user.getId());
    }




}
