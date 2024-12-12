"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./myEvents.css"; // Link the CSS file for styling

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const userEmail = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token");

      if (!userEmail || !token) {
        router.push("/login"); // Redirect to login if token or email is missing
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
        setEvents(data); // Set fetched events to state
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="my-events-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Event Management</h1>
        <div className="navbar-links">
          <button
            className="navbar-link"
            onClick={() => router.push("/attendeeDashboard")}
          >
            Home
          </button>
          <button className="navbar-link logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page Title */}
      <h2 className="my-events-title">My Upcoming Events</h2>

      {loading && <div>Loading events...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Display events in cards */}
      <div className="event-cards">
        {events.length === 0 && !loading ? (
          <div>No events registered</div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.description}</h3>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Organizer:</strong> {event.organizerEmail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvents;
