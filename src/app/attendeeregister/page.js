"use client"; // Ensure this is added for client-side rendering

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RegisterEvent = () => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEventDetails = localStorage.getItem("eventDetails");

    if (!storedEventDetails) {
      setError("Event details not found.");
      return;
    }

    setEvent(JSON.parse(storedEventDetails));
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to register for an event.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/registration", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.eventId,
          attendeeName,
          attendeeEmail,
          ticketType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Registration successful
      alert("Successfully registered for the event!");
      router.push("/attendeeDashboard"); // Redirect back to the dashboard
    } catch (error) {
      setError(`Error registering: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="register-event-container">
      <h1>Register for Event</h1>
      <div className="event-details">
        <h2>{event.eventName}</h2>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Date & Time:</strong> {event.dateTime}</p>
        <p><strong>Description:</strong> {event.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={attendeeEmail}
            onChange={(e) => setAttendeeEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ticket Type:</label>
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            required
          >
            <option value="">Select Ticket Type</option>
            {event.ticketTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterEvent;
