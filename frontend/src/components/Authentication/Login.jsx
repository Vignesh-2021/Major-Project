import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/Home');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%', maxWidth: '1000px', background: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
                
                {/* Left Side Image */}
                <div style={{ flex: 1, background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    <img src="/Group 7.png" alt="Login Illustration" style={{ width: '80%', maxHeight: '400px' }} />
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
                        .form-container a.forgot-password {
                            display: block;
                            text-align: right;
                            font-size: 0.85rem;
                            color: #7b2cbf;
                            margin-bottom: 1rem;
                            text-decoration: none;
                        }
                        .form-container a.forgot-password:hover {
                            text-decoration: underline;
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
                        .form-container .signup-link {
                            text-align: center;
                            margin-top: 1.5rem;
                            font-size: 0.9rem;
                            color: #333;
                        }
                        .form-container .signup-link a {
                            color: #7b2cbf;
                            text-decoration: none;
                            font-weight: 500;
                        }
                        .form-container .signup-link a:hover {
                            text-decoration: underline;
                        }
                    `}</style>

                    <div className="form-container">
                        <h2>Login</h2>
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                            <button type="submit">Login</button>
                        </form>
                        <div className="signup-link">
                            Don't have an account? <a href="/signup">SignUp</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
