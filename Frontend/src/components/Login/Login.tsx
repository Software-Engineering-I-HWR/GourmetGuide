import './Login.css';
import React, {useEffect, useState} from 'react';
import PopupWindow from "../../PopupWindow.tsx";
import {jwtDecode} from 'jwt-decode';
import configData from '../../../../config/frontend-config.json';

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface LoginProps {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const hostData: Config = configData;

const Login: React.FC<LoginProps> = ({isUserLoggedIn, setIsUserLoggedIn}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [showPopupMessage, setShowPopupMessage] = useState(false);

    // Funktion zum Überprüfen des Access Tokens
    const isTokenValid = (token: string) => {
        if (!token) return false;

        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Aktuelle Zeit in Sekunden

            // Überprüfe das 'exp' Feld des Tokens
            return decodedToken.exp > currentTime; // Gültig, wenn 'exp' größer ist als die aktuelle Zeit
        } catch (error) {
            console.error("Token kann nicht dekodiert werden:", error);
            return false;
        }
    };

    const sendLoginRequest = async (email: string, password: string) => {
        return await fetch('https://' + hostData.host + ':30155/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })
            .then(data => data.json());
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Verhindere die Standardformularübermittlung
        try {
            const response = await sendLoginRequest(email, password);
            console.log(response, response.status);

            if (response.message === "Login erfolgreich") {
                // Speichere das E-Mail und den Token im Local Storage
                localStorage.setItem('userEmail', email);
                localStorage.setItem('access token', response.token);

                // Überprüfe die Gültigkeit des Tokens
                const token = response.token;
                if (isTokenValid(token)) {
                    setLoginMessage('Login erfolgreich!');
                    localStorage.setItem('loginMessage', JSON.stringify("Login erfolgreich!"));
                    setIsUserLoggedIn(true);
                    window.location.href = '/';
                } else {
                    setLoginMessage('Token ist ungültig.');
                    localStorage.setItem('loginMessage', JSON.stringify("Token ist ungültig!"));
                    setShowPopupMessage(true);
                }
            } else {
                setLoginMessage('Falsche Anmeldedaten');
                localStorage.setItem('loginMessage', JSON.stringify("Falsche Anmeldedaten!"));
                setShowPopupMessage(true);
            }
        } catch (error) {
            console.error(error);
            setLoginMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Fehlernachricht anzeigen
            localStorage.setItem('loginMessage', JSON.stringify("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut!"));
            setShowPopupMessage(true);
        }
    };

    const handleLogout = () => {
        // Lösche die Daten im Local Storage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access token'); // Lösche gespeicherte E-Mail
        setIsUserLoggedIn(false);
        setLoginMessage('Erfolgreich abgemeldet!'); // Logout-Nachricht anzeigen
        window.location.href = '/';
    };

    useEffect(() => {
        setTimeout(() => {
            setShowPopupMessage(false);
        }, 3000);
    }, [showPopupMessage]);

    return (
        <div className="login-page">
            {showPopupMessage && (
                <PopupWindow message={loginMessage}/>
            )}
            <div className="login-body">
                <div className="login-left">
                    <h1 className="login-title">Login</h1>

                    {isUserLoggedIn ? (
                        <div>
                            <p>Bereits angemeldet als: {localStorage.getItem("userEmail")}</p>
                            <button onClick={handleLogout} className="logout-button">Abmelden</button>
                        </div>
                    ) : (
                        <form className="login-email-field" onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="login-email-field-input"
                            />
                            <input
                                type="password"
                                placeholder="Passwort..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="login-password-field-input"
                            />
                            <button type="submit" className="login-button">Anmelden</button>
                        </form>
                    )}

                    <a href="/register" className="register-button">Registrieren</a>
                    {loginMessage && <p className="login-message">{loginMessage}</p>}
                    <p className="home-button" onClick={() => window.location.href = '/'}> Zurück zur Startseite </p>
                </div>

                <div className="login-right">
                    <img src="/images/Logo.jpg" alt="Logo" className="login-logo"/>
                </div>
            </div>
        </div>
    );
};

export default Login;
