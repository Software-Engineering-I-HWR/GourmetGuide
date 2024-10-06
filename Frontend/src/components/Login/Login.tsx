import './Login.css';
import React, {useEffect, useState} from 'react';
import PopupWindow from "../../PopupWindow.tsx";

interface LoginProps {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({isUserLoggedIn, setIsUserLoggedIn}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [showPopupMessage, setShowPopupMessage] = useState(false);
    //const [isLoggedIn, setIsLoggedIn] = useState(false); // State for logged in status

    useEffect(() => {

        const checkIfLoggedIn = async () => {
            const password = localStorage.getItem('userPassword');
            const email = localStorage.getItem('userEmail');

            if (email && password) {
                const response = await sendLoginRequest(email, password);
                setIsUserLoggedIn(response.ok && response.status === 200);
            } else {
                setIsUserLoggedIn(false);
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

        return await fetch('https://canoob.de:30156/login', {
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
                localStorage.setItem('loginMessage', JSON.stringify("Login erfolgreich!"));
                setIsUserLoggedIn(true);
                window.location.href = '/';
            }

            if (response.status === 401) {
                setLoginMessage('Falsche Anmeldedaten');
                setShowPopupMessage(true);
                //return (<PopupWindow message={loginMessage}/>);
            }

        } catch (error) {
            console.error(error);
            setLoginMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Display error message
            setShowPopupMessage(true);
            //return(<PopupWindow message={loginMessage}/>);

        }
    };

    const handleLogout = () => {
        // Clear the cookie
        localStorage.removeItem('userEmail'); // Clear stored email
        localStorage.removeItem('userPassword');
        setIsUserLoggedIn(false)
        setLoginMessage('Erfolgreich abgemeldet!'); // Show logout message
        localStorage.setItem('loginMessage', JSON.stringify("Erfolgreich abgemeldet"));
        window.location.href = '/';
    };

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isUserLoggedIn));
    }, [isUserLoggedIn]);

    useEffect(() => {
            setTimeout(() => {
                setShowPopupMessage(false);
            }, 5000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <button onClick={handleLogout} className="logout-button">Abmelden
                            </button>
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
