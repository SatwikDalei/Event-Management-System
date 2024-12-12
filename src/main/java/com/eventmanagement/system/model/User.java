package com.eventmanagement.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required.")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @ManyToMany(mappedBy = "attendees")
    private List<Event> events = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles= new ArrayList<>();

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public void addRole(String role){
        if(!roles.contains(role)) roles.add(role);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Name is required.") @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters.") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Name is required.") @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters.") String name) {
        this.name = name;
    }

    public @NotBlank(message = "Email is required.") @Email(message = "Invalid email format.") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required.") @Email(message = "Invalid email format.") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required.") @Size(min = 8, message = "Password must be at least 8 characters long.") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required.") @Size(min = 8, message = "Password must be at least 8 characters long.") String password) {
        this.password = password;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    // Method to get total quantity of tickets sold for all events the user is attending
    public int getTotalTicketsRegistered() {
        int totalTickets = 0;
        for (Event event : events) {
            for (TicketType ticketType : event.getTicketTypes()) {
                // Here, we assume that the quantitySold in TicketType refers to the number of tickets a user has registered for.
                totalTickets += ticketType.getQuantitySold();  // Assuming each ticketType represents all sold tickets for the user
            }
        }
        return totalTickets;
    }
}
