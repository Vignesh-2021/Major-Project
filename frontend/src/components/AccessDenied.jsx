import React from 'react';
import { useNavigate } from 'react-router-dom'; // This helps move to another page
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate(); // This is like a tool to go to another page

  const handleGoToSession = () => {
    console.log('Trying to go to /session page'); // Let’s see if this works
    try {
      navigate('/Sessions'); // Tell the app to go to /session
      console.log('Successfully went to /session'); // If this shows, it worked
    } catch (error) {
      console.error('Something went wrong:', error); // If this shows, there’s an error
    }
  };

  return (
    <div className="access-denied-overlay">
      <div className="access-denied-content">
        <h1>Access Denied</h1>
        <p>Please start a session to access the Summarizer.</p>
        <button onClick={handleGoToSession} style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>
          Go to Session Page
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;