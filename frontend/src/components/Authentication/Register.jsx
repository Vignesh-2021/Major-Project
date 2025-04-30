import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        profileImage: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormData({ ...formData, profileImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        console.log('Sending data:', Object.fromEntries(data));

        try {
            const res = await axios.post('http://localhost:5000/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(res.data.message);
            navigate('/verify-email');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            console.error('Error:', error.response?.data);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                
                {/* Left Image Section */}
                <div style={{ flex: 1, background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <img src="/Group 6.png" alt="Signup Illustration" style={{ width: '80%', maxHeight: '400px' }} />
                </div>

                {/* Right Form Section */}
                <div style={{ flex: 1, padding: '2rem' }}>
                    <style>{`
                        .form-container h2 { text-align: center; font-size: 2rem; font-weight: bold; color: #7b2cbf; text-decoration: underline; margin-bottom: 1.5rem; }
                        .form-container .error { color: red; text-align: center; margin-bottom: 1rem; }
                        .form-container .success { color: green; text-align: center; margin-bottom: 1rem; }
                        .form-container label { display: block; font-weight: 550; margin-bottom: 0.5rem; color: #333; }
                        .form-container input { width: 100%; padding: 0.75rem; border: 1px solid #7b2cbf; border-radius: 8px; margin-bottom: 1rem; box-sizing: border-box; }
                        .form-container input[type="file"] { border: none; }
                        .form-container button { width: 100%; background-color: #7b2cbf; color: white; padding: 0.75rem; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
                        .form-container button:hover { background-color: #5a189a; }
                        .form-container .login-link { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
                        .form-container .login-link a { color: #7b2cbf; text-decoration: none; }
                        .form-container .login-link a:hover { text-decoration: underline; }
                    `}</style>
                    <div className="form-container">
                        <h2>SignUp</h2>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>
                                <label>Username</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>MobileNumber</label>
                                <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>ProfileImage</label>
                                <input type="file" name="profileImage" onChange={handleChange} required />
                            </div>
                            <button type="submit">Sign Up</button>
                        </form>
                        <div className="login-link">
                            Already have an account? <a href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
