import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-green">
        <div className="container">
          <Link className="navbar-brand" to="/">Exploration Bridge</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/activities">Activitiessss</Link>
          </div>
        </div>
      </nav>
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/activities" element={<h1>Activities Page</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;