import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('http://localhost:5000/auth/verifyemail', { code });
            setSuccess(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
                
                {/* Left Side Image */}
                <div style={{ flex: 1, background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <img src="/Group 8.png" alt="Verify Email Illustration" style={{ width: '80%', maxHeight: '400px' }} />
                </div>

                {/* Right Side Form */}
                <div style={{ flex: 1, padding: '3rem' }}>
                    <style>{`
                        .form-container h2 {
                            text-align: center;
                            font-size: 2rem;
                            font-weight: bold;
                            margin-bottom: 1.5rem;
                            color: #7b2cbf;
                            text-decoration: underline;
                        }
                        .form-container .error {
                            color: red;
                            text-align: center;
                            margin-bottom: 1rem;
                        }
                        .form-container .success {
                            color: green;
                            text-align: center;
                            margin-bottom: 1rem;
                        }
                        .form-container label {
                            display: block;
                            margin-bottom: 0.5rem;
                            color: #333;
                            font-weight: 550;
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
                            margin-top: 1rem;
                        }
                        .form-container button:hover {
                            background-color: #5a189a;
                        }
                    `}</style>

                    <div className="form-container">
                        <h2>Verify Email</h2>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Verify Email</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
