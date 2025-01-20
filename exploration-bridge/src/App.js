import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

// Import components from their respective files
import Home from './pages/Home';
import Activities from './pages/Activities';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Get the user role from the cookie
  // const userRole = Cookies.get('userRole'); // This will return 'admin' or 'participant'
  const [userEmail, setUserEmail] = useState(Cookies.get('userEmail') || ''); // Initialize userEmail from cookies

  const handleLogout = () => {
    setUserEmail(''); // Clear userEmail state
    Cookies.remove('userRole');
    Cookies.remove('userEmail');
  };

  return (
    <div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Exploration Bridge</Link>
          {/* {userEmail && <span className="navbar-text">Welcome, {userEmail}</span>} */}
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/activities">Activities</Link>
            <Link className="nav-link" to="/about-us">About Us</Link>
            <Link className="nav-link" to="/contact-us">Contact Us</Link>
            {/* Conditionally render Admin Dashboard link based on user role */}
              <Link className="nav-link" to="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </nav>
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home onLogout={handleLogout}/>} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;