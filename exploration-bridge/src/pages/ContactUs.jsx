import React, { useState,useEffect } from 'react';
import { Form, Button, Tabs, Tab, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const ContactUs = () => {
  const [showFeedbackModal, setShowFeedbackModal] =useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted]= useState(false);
  const [activeTab, setActiveTab] =useState('contact');
  const [events, setEvents] = useState([]); // State to hold events

  //feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    eventName: '',
    rating: '',
    feedback: '',
    improvements: '',
    wouldRecommend: '',
    category: 'general'
  });

   // Fetch events from the backend
   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://exploration-bridge-bend.vercel.app/api/eventsName'); // Adjust the endpoint as necessary
        setEvents(response.data); // Set the events state with the fetched data
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(feedbackForm)
        const response = await axios.post('https://exploration-bridge-bend.vercel.app/api/feedback', feedbackForm);
        console.log('Feedback submitted:', response.data);
        setFeedbackSubmitted(true);
        // Reset the form after submission
        setTimeout(() => {
            setShowFeedbackModal(false);
            setFeedbackSubmitted(false);
            setFeedbackForm({
                eventName: '',
                rating: '',
                feedback: '',
                improvements: '',
                wouldRecommend: '',
                category: 'general'
            });
        }, 2000);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an error submitting your feedback. Please try again.');
    }
};

  return (
    <div className="contact-section bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                {/* <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                > */}
                  {/* <Tab eventKey="contact" title="Contact Us">
                    <h2 className="text-center mb-4">Get in Touch</h2>
                    <div className="contact-info mb-5">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-whatsapp me-3 fs-4"></i>
                        <p className="mb-0">Whatsapp: +60 17 623 2234</p>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-envelope me-3 fs-4"></i>
                        <p className="mb-0">Email: explorationbridge@um.my</p>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-geo-alt me-3 fs-4"></i>
                        <p className="mb-0">Address: 11800 USM, Penang, Malaysia, IMCC</p>
                      </div>
                    </div>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Your Name" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control type="email" placeholder="Your Email" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control as="textarea" rows={5} placeholder="Your Message" required />
                      </Form.Group>
                      <div className="text-center">
                        <Button variant="primary" type="submit" className="px-5">Send Message</Button>
                      </div>
                    </Form>
                  </Tab> */}
                  
                  {/* <Tab eventKey="feedback" title="Event Feedback"> */}
                    <h2 className="text-center mb-4">Event Feedback</h2>
                    <p className="text-center mb-4">
                      We value your feedback! Help us improve our events by sharing your experience.
                    </p>
                    <div className="text-center">
                      <Button 
                        variant="primary" 
                        onClick={() => setShowFeedbackModal(true)}
                        className="px-5"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  {/* </Tab>
                </Tabs> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*feedback*/}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event Feedback Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feedbackSubmitted ? (
            <Alert variant="success">
              Thank you for your feedback! Your input helps us improve our events.
            </Alert>
          ) : (
            <Form onSubmit={handleFeedbackSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Event Name</Form.Label>
                <Form.Select 
                  required
                  value={feedbackForm.eventName}
                  onChange={(e)=> setFeedbackForm(  {...feedbackForm, eventName: e.target.value})}
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event._id} value={event.eventName}>{event.eventName}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={feedbackForm.category}
                  onChange={(e) =>setFeedbackForm({...feedbackForm, category: e.target.value})}
                >
                  <option value="general">General Feedback</option>
                  <option value="content">Event Content</option>
                  <option value="organization">Event Organization</option>
                  <option value="venue">Venue & Facilities</option>
                </Form.Select>
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label>Overall Rating</Form.Label>
                <Form.Select 
                  required
                  value={feedbackForm.rating}
                  onChange={(e) =>setFeedbackForm({...feedbackForm, rating: e.target.value})  }
                >
                  <option value="">Select rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 -Good</option>
                  <option value="2">2 -Fair</option>
                  <option value="1">1 - Poor</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>What did you like about the event?  </Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={  feedbackForm.feedback}
                  onChange={(e) => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>What could be improved? </Form.Label>
                <Form.Control 
                  as="textarea"  rows={3}
                  value={feedbackForm.improvements}
                  onChange={(e) => setFeedbackForm({...feedbackForm, improvements: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                
                <Form.Label>Would you recommend this event to others?</Form.Label>
                <Form.Select
                  value={feedbackForm.wouldRecommend}
                  onChange={(e) => setFeedbackForm({...feedbackForm, wouldRecommend: e.target.value})}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes, definitely</option>
                  <option value="maybe">Maybe</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit">Submit Feedback</Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContactUs;