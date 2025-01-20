import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Activities = () => {
  const userRole = 'participant'; // or 'administrator'

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequirements: '',
    eventName: '' // This will be set when an activity is selected
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://exploration-bridge-bend.vercel.app/api/events');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setRegistrationForm({ 
      fullName: '', 
      email: '', 
      phone: '', 
      specialRequirements: '', 
      eventName: activity.eventName // Set the event name when an activity is selected
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedActivity(null);
    // Reset the form values when closing the modal
    setRegistrationForm({
      fullName: '',
      email: '',
      phone: '',
      specialRequirements: '',
      eventName: ''
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if all required fields are filled
    if (registrationForm.fullName && registrationForm.email && registrationForm.phone) {
      try {
        // Send the entire registration form to the backend
        const response = await axios.post('https://exploration-bridge-bend.vercel.app/api/register-activity', registrationForm);
        console.log('Activity registered:', response.data);
        
        // Optionally, show a success message here
        alert('Registration successful!');

        // Reset the form values without closing the modal
        setRegistrationForm({
          fullName: '',
          email: '',
          phone: '',
          specialRequirements: '',
          eventName: registrationForm.eventName // Keep the event name
        });
      } catch (error) {
        console.error('Error registering activity:', error);
        alert('There was an error registering for the activity. Please try again.');
      }
    } else {
      alert('Please fill in all required fields before submitting.');
    }
  };

  const ParticipantModal = () => (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedActivity?.eventName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5>Event Details</h5>
          <p><strong>Date:</strong>{selectedActivity?.date}</p>
          <p><strong>Time:</strong> {selectedActivity?.time}</p>
          <p><strong>Venue:</strong>{selectedActivity?.venue}</p>
          <p><strong>Description:</strong> {selectedActivity?.description}</p>
        </div>
        <Form onSubmit={handleRegistrationSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              type="text" 
              name="fullName" // Add name attribute
              required 
              value={registrationForm.fullName} // Use registrationForm for controlled input
              onChange={(e) => setRegistrationForm({ ...registrationForm, fullName: e.target.value })} // Update registrationForm on change
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" // Add name attribute
              required 
              value={registrationForm.email} // Use registrationForm for controlled input
              onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })} // Update registrationForm on change
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control 
              type="tel" 
              name="phone" // Add name attribute
              required 
              value={registrationForm.phone} // Use registrationForm for controlled input
              onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })} // Update registrationForm on change
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Special Requirements</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="specialRequirements" // Add name attribute
              value={registrationForm.specialRequirements} // Use registrationForm for controlled input
              onChange={(e) => setRegistrationForm({ ...registrationForm, specialRequirements: e.target.value })} // Update registrationForm on change
            />
          </Form.Group>
          <Button variant="primary" type="submit">Register for Event</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Our Activities</h1>
      <div className="row g-4">
        {activities.map((activity, index) => {
          const imagePath = activity.image.replace(/\\/g, '/'); // Replace backslashes with forward slashes
          const imageUrl = `http://localhost:5000/uploads/${imagePath.split('/').pop()}`; // Construct the URL

          return (
            <div key={index} className="col-md-4">
              <div className="card h-100 activity-card"
                onClick={() => handleActivityClick(activity)} // Handle click to show form
                style={{ cursor: 'pointer' }}
              >
                <img src={imageUrl} className="card-img-top" alt={activity.title} />
                <div className="card-body text-center">
                  <h3 className="card-title">{activity.eventName}</h3>
                  <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                    {activity.description}
                  </p>
                  <p className="text-muted">Click for details</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && selectedActivity && (
        <ParticipantModal />
      )}
    </div>
  );
};

export default Activities;