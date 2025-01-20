import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const Home = ()=> {

  const [showRegister, setShowRegister] =useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');
  const [signInMessage, setSignInMessage] = useState('');


  //Modal 
  const handleRegisterClose =() => setShowRegister(false);
  const handleRegisterShow = ()=>setShowRegister(true);
  const handleSignInClose =() =>setShowSignIn(false);
  const handleSignInShow =() =>setShowSignIn(true);

  //Form 
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;
    const role = 'participant';

    try {
      const response = await axios.post('https://exploration-bridge-bend.vercel.app/api/register', {
        fullName,
        email,
        password,
        role
      });
      setRegisterMessage(response.data.message);
      handleRegisterClose();
    } catch (error) {
      console.error('Error registering:', error);
      setRegisterMessage('Error registering user. Please try again.');
    }
  };

  const handleSignInSubmit =async (e)=> {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log('Signing in with:', { email, password }); // Log credentials for debugging

    try {
      const response = await axios.post('https://exploration-bridge-bend.vercel.app/api/signin', {
        email,
        password
      });
      // Assuming the response contains the user role and email
      const { role, email: userEmail } = response.data.user; // Adjust based on your API response
      Cookies.set('userRole', role, { expires: 7 }); // Set cookie for 7 days
      Cookies.set('userEmail', userEmail, { expires: 7 }); // Set cookie for 7 days
      Cookies.set('sessionId', response.data.sessionId, { expires: 7 }); // Store session ID in a cookie
      setSignInMessage(response.data.message);
      handleSignInClose();
    } catch (error) {
      console.error('Error signing in:', error);
      setSignInMessage('Invalid email or password. Please try again.');
    }
  };

  const handleLogout = () => {
    // Remove user cookies
    Cookies.remove('userRole');
    Cookies.remove('userEmail');
    Cookies.remove('sessionId'); // Remove session ID cookie

    setSignInMessage('You have logged out successfully.'); // Optional message
    console.log('User logged out'); // Log logout action
  };

  return (

    <div className="hero-section position-relative">
      <div className="overlay position-absolute w-100 h-100 bg-dark" style={{ backgroundImage: 'url(images/ysjf.png)', opacity: 0.6 }}></div>
      <div className="container min-vh-100 d-flex flex-column justify-content-center text-center text-white position-relative">
        <h1 className="display-1 fw-bold">#WE LEAD  </h1>
        <p className="lead"> IMCC Exploration Trip, Connect Info, Connect Globally, Ignite Collaboration</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="btn btn-primary px-4 py-2" onClick={handleRegisterShow}>
            Register
          </button>
          <button className="btn btn-outline-light px-4 py-2" onClick= {handleSignInShow}>
            Sign In
          </button>
          <span onClick={handleLogout} style={{ cursor: 'pointer', color: 'white' }}>
            Logout
          </span>
          {signInMessage && <p>{signInMessage}</p>}
        </div>
      </div>


      <Modal show={showRegister} onHide={handleRegisterClose}>
        <Modal.Header closeButton>
          <Modal.Title>  Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name </Form.Label>
              <Form.Control type="text" name="fullName" placeholder="Enter your full name" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder=  "Enter email" required />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password  </Form.Label>
              <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" required />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showSignIn} onHide={handleSignInClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignInSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" required />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" required>
                <option value="">Select your role</option>
                <option value="participant">Participant</option>
                <option value="administrator">Administrator</option>
              </Form.Select>
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </div>
            <div className="text-center mt-3">
              <a href="#" className="text-decoration-none">Forgot password?</a>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;