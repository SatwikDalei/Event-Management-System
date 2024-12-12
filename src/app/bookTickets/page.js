"use client"; // Ensure this is added for client-side rendering

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./bookTickets.css"; // Optional, for styling

const RegisterEvent = () => {
  const router = useRouter();
  const [eventId, setEventId] = useState(""); // Event ID (could be passed as a prop or retrieved from localStorage)
  const [name, setName] = useState(""); // Name input
  const [ticketTypeName, setTicketTypeName] = useState(""); // Ticket type input
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [error, setError] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // UseEffect to retrieve eventId if it is passed from localStorage or navigation
  useEffect(() => {
    const storedEventId = localStorage.getItem("eventId"); // Get eventId from localStorage if available
    if (storedEventId) {
      setEventId(storedEventId); // Set the eventId in state
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure eventId, name, and ticketTypeName are provided
    if (!eventId || !name || !ticketTypeName) {
      setError("Event ID, name, or ticket type is missing. Please ensure you provide all details.");
      return;
    }

    try {
      // Make the POST request to the backend
      const response = await fetch("http://localhost:8080/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach JWT token for authorization
        },
        body: JSON.stringify({
          eventId: eventId, // Pass eventId from state
          userName: name, // Pass name input from state
          ticketTypeName: ticketTypeName, // Pass ticket type input from state
          quantity: quantity, // Pass quantity input from state
        }),
      });

      const responseData = await response.text(); // Get the response text

      if (!response.ok) {
        setError(responseData); // Set error message if request failed
        return;
      }

      setSuccessMessage(responseData); // Set success message if registration is successful

      // Redirect to the attendee dashboard after a short delay
      setTimeout(() => {
        router.push("/attendeeDashboard");
      }, 2000);
    } catch (err) {
      setError("An error occurred while registering for the event.");
    }
  };

  return (
    <div className="register-event-container">
      <h1>Register for Event</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="eventId">Event ID:</label>
          <input
            type="text"
            id="eventId"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketTypeName">Ticket Type:</label>
          <input
            type="text"
            id="ticketTypeName"
            value={ticketTypeName}
            onChange={(e) => setTicketTypeName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterEvent;
