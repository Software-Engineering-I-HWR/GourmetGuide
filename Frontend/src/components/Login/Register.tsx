import './Register.css';
import React, {useEffect, useState} from 'react';
import PopupWindow from "../../PopupWindow.tsx";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');
    const [showPopupMessage, setShowPopupMessage] = useState(false);

    const enterEmailAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const enterPasswordRepeat = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(event.target.value);
    }

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        if (password == passwordRepeat) {
            try {
                const response = await fetch('https://canoob.de:30156/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                });

                if (response.status === 200) {
                    setRegisterMessage('Registrieren erfolgreich!');
                    localStorage.setItem('loginMessage', JSON.stringify("Registrieren erfolgreich!"));
                    setShowPopupMessage(true);
                }

                if (response.status === 500) {
                    setRegisterMessage('User Existiert schon');
                    localStorage.setItem('loginMessage', JSON.stringify("User existiert schon!"));
                    setShowPopupMessage(true);
                }

            } catch (error) {
                console.error(error);
                setShowPopupMessage(true);
                setRegisterMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Display error message
                localStorage.setItem('loginMessage', JSON.stringify("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut!"));
            }

        } else {
            setShowPopupMessage(true);
            setRegisterMessage('Unterschiedliche Passwörter eingegeben')
            localStorage.setItem('loginMessage', JSON.stringify("Unterschiedliche Passwörter eingegeben!"));
        }
    }
    useEffect(() => {
        setTimeout(() => {
            setShowPopupMessage(false);
        }, 3000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPopupMessage]);

    return (
        <div className="register-page">
            {showPopupMessage && (
                <PopupWindow message={registerMessage}/>
            )}
            <div className="register-body">
                <form className="register-left" onSubmit={handleRegister}>
                    <h1 className="register-title">Registrieren</h1>

                    <div className="register-email-field">
                        <input
                            type="text"
                            placeholder="Username..."
                            value={email}
                            onChange={enterEmailAdress}
                            className="register-email-field-input"
                        />
                    </div>
                    <div className="register-password-field">
                        <input
                            type="password"
                            placeholder="Passwort..."
                            value={password}
                            onChange={enterPassword}
                            className="register-password-field-input"
                        />
                    </div>
                    <div className="register-password-repeat-field">
                        <input
                            type="password"
                            placeholder="Passwort wiederholen..."
                            value={passwordRepeat}
                            onChange={enterPasswordRepeat}
                            className="register-password-repeat-field-input"
                        />
                    </div>

                        <button type="submit" className="login-button">Registrieren</button>

                    {/* Render the login message */}
                    {registerMessage && <p className="register-message">{registerMessage}</p>}

                    <p className="home-button" onClick={() => window.location.href = '/'}> Zurück zur Startseite </p>
                </form>

                <div className="register-right">
                <img src="/images/Logo.jpg" alt="Logo" className="login-logo"/>
                </div>

            </div>
        </div>
    )
};

export default Register;