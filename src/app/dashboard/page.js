"use client"; // Add this line at the top

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css"; // Ensure the CSS is correctly linked

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the token and email exist in localStorage
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) {
      // Redirect to login page if token or email are missing
      router.push("/login");
      return;
    }

    // Fetch events for the organizer
    const fetchEvents = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const response = await fetch(
          `http://localhost:8080/api/organizers/dashboard?organizerEmail=${userEmail}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Use Bearer token for authorization
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data)) {
          setEvents(data);
        } else {
          setError("No events found.");
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Navigate to Create Event page
  const handleCreateEvent = () => {
    router.push("/createEvent");
  };

  // Navigate to Update Event page for the specific event
  const handleUpdateEvent = (eventId) => {
    // Store the event ID in localStorage
    localStorage.setItem("eventId", eventId);
  
    // Redirect to the createEvent page (can be used for both create and update)
    router.push("/updateEvent");
  };

  // Delete event function
  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Missing authentication token.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/events/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted event from the state
      setEvents(events.filter(event => event.eventId !== eventId));
    } catch (error) {
      setError(`Error deleting event: ${error.message}`);
    }
  };

  // Refresh page on Home button click
  const handleHomeClick = () => {
    window.location.reload();
  };

  // Logout function
  const handleLogout = () => {
    // Remove token and user email from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
        <h1 className="navbar-title">Organizer Dashboard - Event Management System</h1>
        <div className="navbar-item" onClick={handleHomeClick}>
          Home
        </div>
        <div className="navbar-item" onClick={handleCreateEvent}>
          Create Event
        </div>
        <div className="navbar-item" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {loading && <div>Loading events...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="event-cards">
        {events.length === 0 ? (
          <div>No events found</div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.eventId}>
              <h2>{event.eventName}</h2>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Date & Time:</strong> {event.dateTime}
              </p>
              <div className="ticket-summary">
                {event.ticketTypeSummaries.map((ticketSummary, index) => (
                  <div key={index}>
                    <h3>{ticketSummary.ticketType}</h3>
                    <p>Sold: {ticketSummary.ticketsSold}</p>
                    <p>Remaining: {ticketSummary.ticketsRemaining}</p>
                    <p>Revenue: ${ticketSummary.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <p>
                <strong>Total Attendees:</strong> {event.totalAttendees}
              </p>
              <p>
                <strong>Total Revenue:</strong> ${event.totalRevenue.toFixed(2)}
              </p>

              {/* Add Update Event Button */}
              <button onClick={() => handleUpdateEvent(event.eventId)} className="update-event-button">
                Update Event
              </button>

              {/* Add Delete Event Button */}
              <button onClick={() => handleDeleteEvent(event.eventId)} className="delete-event-button">
                Delete Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
