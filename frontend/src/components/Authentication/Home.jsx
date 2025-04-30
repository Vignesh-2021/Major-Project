import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <nav style={{ backgroundColor: '#1e90ff', color: 'white', padding: '1rem' }}>
                <style>
                    {`
                        nav .container {
                            max-width: 1200px;
                            margin: 0 auto;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        nav a {
                            color: white;
                            text-decoration: none;
                            margin-right: 1rem;
                        }
                        nav a:hover {
                            text-decoration: underline;
                        }
                        nav button {
                            background-color: #ff4040;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        nav button:hover {
                            background-color: #cc3333;
                        }
                    `}
                </style>
                <div className="container">
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        StudyBuddy
                    </Link>
                    <div>
                        {user ? (
                            <>
                                <Link to="/dashboard">Dashboard</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <style>
                    {`
                        .home-container h1 {
                            font-size: 2.5rem;
                            font-weight: bold;
                            margin-bottom: 1rem;
                        }
                        .home-container p {
                            font-size: 1.2rem;
                            margin-bottom: 1.5rem;
                        }
                        .home-container a {
                            display: inline-block;
                            padding: 0.75rem 1.5rem;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                            margin-right: 1rem;
                        }
                        .home-container a.register {
                            background-color: #1e90ff;
                        }
                        .home-container a.login {
                            background-color: #666;
                        }
                        .home-container a:hover {
                            opacity: 0.9;
                        }
                    `}
                </style>
                <div className="home-container">
                    <h1>Welcome to StudyBuddy</h1>
                    <p>
                        Join our community to enhance your learning experience. Register or login to get started!
                    </p>
                    <div>
                        <a href="/register" className="register">Register</a>
                        <a href="/login" className="login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;