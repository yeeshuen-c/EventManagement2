import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    image: null, // Initialize as null for file
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    isPastEvent: false,
    category: '',
    feedback: '',
    rating: '',
    experience: '',
    improvements: '',
    wouldRecommend: '',
  });
  const [message, setMessage] = useState('');
  const userRole = Cookies.get('userRole'); // Get user role from cookie

  useEffect(() => {
    console.log(userRole)
    if (userRole !== 'admin') {
      setMessage('Access denied. You do not have permission to view this page.');
      return; // Exit early if not admin
    }

    // Fetch existing events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [userRole]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append form data
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://exploration-bridge-bend.vercel.app/api/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      // Optionally, fetch events again to update the list
      const updatedEvents = await axios.get('https://exploration-bridge-bend.vercel.app/api/events');
      setEvents(updatedEvents.data);
      setFormData({
        eventName: '',
        image: null, // Reset to null
        description: '',
        date: '',
        time: '',
        venue: '',
        capacity: '',
        isPastEvent: false,
        category: '',
        feedback: '',
        rating: '',
        experience: '',
        improvements: '',
        wouldRecommend: '',
      });
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage('Error adding event. Please try again.');
    }
  };

  // Render nothing if user is not admin
  if (userRole !== 'admin') {
    return (
      <div>
        <Alert variant="danger">{message}</Alert>
      </div>
    ); // Display access denied message
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="eventName">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Image Upload</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="time">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="venue">
          <Form.Label>Venue</Form.Label>
          <Form.Control
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="capacity">
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="isPastEvent">
          <Form.Check
            type="checkbox"
            name="isPastEvent"
            label="Is Past Event?"
            checked={formData.isPastEvent}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Add Event</Button>
      </Form>

      <h2 className="mt-4">Existing Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>{event.eventName} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;