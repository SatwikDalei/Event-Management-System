package com.eventmanagement.system.controller;

import com.eventmanagement.system.dto.EventDashboardDTO;
import com.eventmanagement.system.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")  // Global CORS configuration
@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    @PreAuthorize("hasRole('USER')")  // Ensures only users with the USER role can access this endpoint
    @GetMapping("/dashboard")
    public ResponseEntity<?> getOrganizerDashboard(@RequestParam String organizerEmail) {
        try {
            List<EventDashboardDTO> dashboardData = organizerService.getOrganizerDashboard(organizerEmail);

            if (dashboardData.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "No events found for the organizer."));
            }

            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "An error occurred: " + e.getMessage()));
        }
    }
}
