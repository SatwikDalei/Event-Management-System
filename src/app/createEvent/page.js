'use client';  // <-- Add this line

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import './createEvent.css'; // Correct the import path for CSS

const EventCreationForm = () => {
  const [eventData, setEventData] = useState({
    description: '',
    location: '',
    dateTime: '',
    isPrivate: false,
    ticketTypes: [{ name: '', price: 0, quantityAvailable: 0 }],
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for managing submission status
  const router = useRouter(); // Router hook for redirection

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle ticket type changes
  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTicketTypes = [...eventData.ticketTypes];
    updatedTicketTypes[index][name] = value;
    setEventData((prevData) => ({
      ...prevData,
      ticketTypes: updatedTicketTypes,
    }));
  };

  // Add a new ticket type
  const addTicketType = () => {
    setEventData((prevData) => ({
      ...prevData,
      ticketTypes: [
        ...prevData.ticketTypes,
        { name: '', price: 0, quantityAvailable: 0 },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show loading status
    setIsSubmitting(true);

    // Get the organizer email and token from local storage
    const organizerEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token'); // Get token

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return; // Prevent the form submission if token is not found
    }

    // Add organizerEmail to the eventData
    const eventDataWithEmail = { ...eventData, organizerEmail };

    // Make the API request with token in Authorization header
    axios
      .post('http://localhost:8080/api/events/createEvent', eventDataWithEmail, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      })
      .then((response) => {
        console.log('Event created successfully:', response);
        setSuccessMessage('Event created successfully!');
        
        // Delay the redirection to show success message
        setTimeout(() => {
          router.push('/dashboard'); // Redirect to the dashboard page
        }, 2000); // Wait for 2 seconds before redirecting
      })
      .catch((error) => {
        console.error('Error creating event:', error.response || error);
        // Handle error (e.g., show an error message)
        setIsSubmitting(false); // Reset submission status if error occurs
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create Event</h2>
      
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={eventData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Date & Time:</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={eventData.dateTime}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>Private Event:</label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={eventData.isPrivate}
          onChange={(e) =>
            setEventData((prevData) => ({
              ...prevData,
              isPrivate: e.target.checked,
            }))
          }
        />
      </div>

      <div>
        <label>Ticket Types:</label>
        {eventData.ticketTypes.map((ticket, index) => (
          <div key={index} className="ticketInput">
            <input
              type="text"
              name="name"
              placeholder="Ticket Name"
              value={ticket.name}
              onChange={(e) => handleTicketChange(index, e)}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Ticket Price"
              value={ticket.price}
              onChange={(e) => handleTicketChange(index, e)}
              required
            />
            <input
              type="number"
              name="quantityAvailable"
              placeholder="Quantity Available"
              value={ticket.quantityAvailable}
              onChange={(e) => handleTicketChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addTicketType}>
          Add Ticket Type
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </button>

      {successMessage && <p className="successMessage">{successMessage}</p>}
    </form>
  );
};

export default EventCreationForm;
