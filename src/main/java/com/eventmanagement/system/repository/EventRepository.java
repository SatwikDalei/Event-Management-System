package com.eventmanagement.system.repository;


import com.eventmanagement.system.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event,Long> {
    List<Event> findByLocationContainingIgnoreCase(String location);
    List<Event> findByOrganizerEmail(String organizerEmail);
    boolean existsByDescriptionAndLocation(String description, String location);

    List<Event> findByDescriptionContainingIgnoreCase(String description);
    @Query("SELECT e FROM Event e JOIN e.attendees u WHERE u.id = :userId")
    List<Event> findEventsByUserId(Long userId);
}
