import './Login.css';
import React, { useState, useEffect } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State for logged-in status

    // Check for authentication cookie on component mount
    useEffect(() => {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('authToken='));

        if (cookie) {
            setIsLoggedIn(true);
            setEmail(localStorage.getItem('userEmail') || ''); // Get the stored email
        }
    }, []);

    const enterEmailAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            }

            // Set cookie in frontend
            document.cookie = `authToken=${data.token}; path=/; max-age=86400;`; // 1 day expiration

            // Store email in local storage
            localStorage.setItem('userEmail', email);

            // Show success message and set logged-in status
            setLoginMessage('Login erfolgreich!');
            setIsLoggedIn(true);

        } catch (error) {
            console.error(error);
            setLoginMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Display error message
        }
    };

    const handleLogout = () => {
        // Clear the cookie
        document.cookie = 'authToken=; Max-Age=0; path=/'; // Clear the cookie
        localStorage.removeItem('userEmail'); // Clear stored email
        setIsLoggedIn(false); // Update logged-in status
        setLoginMessage('Erfolgreich abgemeldet!'); // Show logout message
    };

    return (
        <div className="login-page">
            <div className="login-body">
                <div className="login-left">
                    <h1 className="login-title">Login</h1>

                    {isLoggedIn ? (
                        <div>
                            <p>Bereits angemeldet als: {email}</p>
                            <button onClick={handleLogout} className="logout-button">Abmelden</button>
                        </div>
                    ) : (
                        <form className="login-email-field" onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="E-Mail-Adresse..."
                                value={email}
                                onChange={enterEmailAdress}
                                className="login-email-field-input"
                            />
                            <input
                                type="password"
                                placeholder="Passwort..."
                                value={password}
                                onChange={enterPassword}
                                className="login-password-field-input"
                            />
                            <button type="submit" className="login-button">Anmelden</button>
                        </form>
                    )}


                    <a type="Submit" href="/register" className="register-button">Registrieren</a>
                    {/* Render the login message */}
                    {loginMessage && <p className="login-message">{loginMessage}</p>}
                </div>

                <div className="login-right">
                    <img src="/../../public/images/Logo.jpg" alt="Logo" className="login-logo" />
                </div>
            </div>
        </div>
    );
};

export default Login;
