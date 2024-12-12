"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./attendeeDashboard.css"; // Link the CSS file for styling

const AttendeeDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch events for the attendee on initial load
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        router.push("/login"); // Redirect to login if token or email is missing
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/events/search?email=${userEmail}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data); // Set fetched events to state
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Handle registration for an event
  const handleRegister = (eventId) => {
    localStorage.setItem("eventId", eventId); // Store eventId in localStorage
    router.push("/bookTickets"); // Redirect to registration page
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  // Handle fetching registered events
  const handleMyUpcomingEvents = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (!userEmail || !token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/events/registered?email=${userEmail}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data); // Set fetched registered events to state
      router.push("/myEvents"); // Navigate to /myEvents after fetching data
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendee-dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Attendee Dashboard</h1>
        <div className="navbar-links">
          <button
            className="navbar-link"
            onClick={handleMyUpcomingEvents} // Trigger the API call and navigate to /myEvents
          >
            My Upcoming Events
          </button>
          <button className="navbar-link logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <h2 className="dashboard-title">Available Events</h2>
      {loading && <div>Loading events...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="event-cards">
        {events.length === 0 && !loading ? (
          <div>No events available</div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.description}</h3>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Organizer:</strong> {event.organizerEmail}</p>
              <div className="ticket-details">
                <strong>Tickets:</strong>
                <ul>
                  {event.ticketTypes.map((ticket, index) => (
                    <li key={index}>
                      {ticket.name} - ₹{ticket.price} ({ticket.quantityAvailable} available)
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleRegister(event.id)}
                className="register-button"
              >
                Register
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboard;
