package com.eventmanagement.system.controller;

import com.eventmanagement.system.dto.EventSearchDTO;
import com.eventmanagement.system.exception.ConflictException;
import com.eventmanagement.system.model.Event;
import com.eventmanagement.system.repository.EventRepository;
import com.eventmanagement.system.repository.TicketTypeRepository;
import com.eventmanagement.system.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @GetMapping("/getEventDetails/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        try {
            Event event = eventService.getEventById(id);
            if (event == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Return 404 if event not found
            }
            return new ResponseEntity<>(event, HttpStatus.OK); // Return 200 with event data
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Return 500 if there's an error
        }
    }

    //Works

    @PostMapping("/createEvent")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            System.out.println("Creating event with description: " + event.getDescription());
            Optional<Event> savedEvent = eventService.createEvent(event);

            if (savedEvent.isPresent()) {
                EventSearchDTO eventSearchDTO = eventService.mapToEventSearchDTO(savedEvent.get());
                return ResponseEntity.status(201).body(eventSearchDTO); // Return EventSearchDTO
            } else {
                System.out.println("Event already exists with description: " + event.getDescription());
                throw new ConflictException("An Event with the following details already exists.");
            }
        } catch (Exception e) {
            System.err.println("Error creating event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error. Please try again later.");
        }
    }


    //Works
    @GetMapping("/search")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> searchEvents(@RequestParam(required = false) String description,
                                          @RequestParam(required = false) String location) {
        List<EventSearchDTO> events = eventService.searchEvents(description, location);
        if (events.isEmpty()) {
            throw new EntityNotFoundException("No events found matching the criteria.");
        }
        return ResponseEntity.ok(events); // Return EventSearchDTO
    }


    //Works
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('USER')")  // Ensure that only users with the role 'USER' can delete
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        boolean deleted = eventService.deleteEvent(id);  // Call service to delete the event by ID
        if (!deleted) {
            throw new EntityNotFoundException("Event with ID " + id + " not found.");  // Throw error if event is not found
        }
        return ResponseEntity.ok("Event with ID " + id + " has been deleted successfully.");  // Success response
    }



    //Works

    @PutMapping("/updateEvent/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Map<String, Object> updateFields) {
        String description = (String) updateFields.get("description");
        String location = (String) updateFields.get("location");
        String dateTime = (String) updateFields.get("dateTime");
        Boolean isPrivate = (Boolean) updateFields.get("isPrivate");

        Event updatedEvent = eventService.updateEvent(id, description, location, dateTime, isPrivate);
        if (updatedEvent == null) {
            throw new EntityNotFoundException("Event with ID " + id + " not found.");
        }
        return ResponseEntity.ok(updatedEvent);
    }


    // Works
    @PostMapping("/register")
    @PreAuthorize("hasRole('ATTENDEE')")
    public ResponseEntity<String> registerForEvent(@RequestBody Map<String, Object> requestBody) {
        try {
            Long eventId = Long.valueOf(requestBody.get("eventId").toString());
            String userName = requestBody.get("userName").toString();
            String ticketTypeName = requestBody.get("ticketTypeName").toString();
            int quantity = Integer.parseInt(requestBody.get("quantity").toString());

            String response = eventService.registerForEvent(eventId, userName, ticketTypeName, quantity);
            if (response.contains("not found") || response.contains("Not enough tickets")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
        }
    }
    @GetMapping("/registered")
    @PreAuthorize("hasRole('ATTENDEE')")
    public ResponseEntity<?> getRegisteredEvents(@RequestParam String email) {
        try {
            List<Event> events = eventService.getEventsForUserByEmail(email);
            if (events.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No registered events found for this email.");
            }
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching events.");
        }
    }





}
