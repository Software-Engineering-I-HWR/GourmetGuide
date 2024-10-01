import './Login.css';
import React, {useEffect, useState} from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State for logged in status

    useEffect(() => {

        const checkIfLoggedIn = async () => {
            const password = localStorage.getItem('userPassword');
            const email = localStorage.getItem('userEmail');

            if (email && password) {
                const response = await sendLoginRequest(email, password);
                setIsLoggedIn(response.ok && response.status === 200);
            } else {
                setIsLoggedIn(false);
            }
        }

        checkIfLoggedIn();

    }, [])

    // Check for authentication cookie on component mount

    const enterEmailAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const sendLoginRequest = async (email: string, password: string) => {

        return await fetch('http://canoob.de:30156/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        try {

            const response = await sendLoginRequest(email, password);

            if (response.status === 200) {
                // Store email in local storage
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPassword', password);

                // Show success message and set logged-in status
                setLoginMessage('Login erfolgreich!');
                setIsLoggedIn(true);
            }

            if (response.status === 401) {
                setLoginMessage('Falsche Anmeldedaten');
            }

        } catch (error) {
            console.error(error);
            setLoginMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Display error message
        }
    };

    const handleLogout = () => {
        // Clear the cookie
        localStorage.removeItem('userEmail'); // Clear stored email
        localStorage.removeItem('userPassword');
        setIsLoggedIn(false)
        setLoginMessage('Erfolgreich abgemeldet!'); // Show logout message
    };

    return (
        <div className="login-page">
            <div className="login-body">
                <div className="login-left">
                    <h1 className="login-title">Login</h1>

                    {isLoggedIn ? (
                        <div>
                            <p>Bereits angemeldet als: {localStorage.getItem("userEmail")}</p>
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
                    <img src="/../../public/images/Logo.jpg" alt="Logo" className="login-logo"/>
                </div>
            </div>
        </div>
    );
};

export default Login;
