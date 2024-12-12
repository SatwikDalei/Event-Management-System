"use client"; // Add this line for client-side rendering

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./updateEvent.css"; // Ensure proper styling

const UpdateEvent = ({ params }) => {
  const { id } = params; // Get event ID from URL
  const router = useRouter();
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const eventId = localStorage.getItem("eventId"); // Get event ID from localStorage
  
        if (!token || !eventId) {
          setError("Missing authentication token or event ID.");
          return;
        }
  
        const response = await fetch(`http://localhost:8080/api/events/getEventDetails/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        setError(`Error fetching event details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Get event ID from localStorage (this should be the correct event ID)
    const eventId = localStorage.getItem("eventId");
    if (!eventId) {
      setError("Event ID is missing.");
      return;
    }
  
    // Ensure the eventData object is structured properly
    const updatedData = {
      description: eventData.description,
      location: eventData.location,
      dateTime: eventData.dateTime,
      isPrivate: eventData.isPrivate,
    };
  
    console.log("Updated Data being sent:", updatedData);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Missing authentication token.");
        return;
      }
  
      // Pass the eventId in the URL correctly
      const response = await fetch(`http://localhost:8080/api/events/updateEvent/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      alert("Event updated successfully!");
      router.push("/dashboard"); // Redirect to the dashboard
  
      // Clear event ID from localStorage after successful update
      localStorage.removeItem("eventId");
  
    } catch (error) {
      setError(`Error updating event: ${error.message}`);
    }
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="update-event-container">
      <h1>Update Event</h1>
      <form onSubmit={handleUpdate}>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={eventData.location || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date & Time:
          <input
            type="datetime-local"
            name="dateTime"
            value={eventData.dateTime || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={eventData.description || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Is Private:
          <input
            type="checkbox"
            name="isPrivate"
            checked={eventData.isPrivate || false}
            onChange={(e) => handleChange({ target: { name: "isPrivate", value: e.target.checked } })}
          />
        </label>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default UpdateEvent;
