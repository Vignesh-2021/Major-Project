import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '80%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
        
        {/* Left Image */}
        <div style={{ flex: 1, background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <img src="/Group 10.png" alt="Forgot Password" style={{ width: '80%', maxHeight: '400px' }} />
        </div>

        {/* Right Form */}
        <div style={{ flex: 1, padding: '3rem' }}>
          <style>{`
            .form-container h2 {
              text-align: center;
              font-size: 2rem;
              font-weight: bold;
              color: #7b2cbf;
              text-decoration: underline;
              margin-bottom: 0.5rem;
            }
            .form-container p.subtitle {
              text-align: center;
              color: #333;
              margin-bottom: 1.5rem;
            }
            .form-container label {
              display: block;
              color: #333;
              font-weight: 550;
              margin-bottom: 0.5rem;
            }
            .form-container input {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #7b2cbf;
              border-radius: 8px;
              margin-bottom: 1rem;
              box-sizing: border-box;
            }
            .form-container button {
              width: 100%;
              background-color: #7b2cbf;
              color: white;
              padding: 0.75rem;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: bold;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              cursor: pointer;
              margin-top: 0.5rem;
            }
            .form-container button:hover {
              background-color: #5a189a;
            }
            .form-container .error {
              color: red;
              text-align: center;
              margin-top: 1rem;
            }
            .form-container .success {
              color: green;
              text-align: center;
              margin-top: 1rem;
            }
          `}</style>

          <div className="form-container">
            <h2>Forgot Password</h2>
            <p className="subtitle">Enter your email to receive a password reset code.</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Send Reset Code</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
