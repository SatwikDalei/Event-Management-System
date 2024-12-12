package com.eventmanagement.system.repository;

import com.eventmanagement.system.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    @Query("SELECT t FROM TicketType t WHERE t.name = :name AND t.event.id = :eventId")
    TicketType findByNameAndEventId(@Param("name") String name, @Param("eventId") Long eventId);
}
