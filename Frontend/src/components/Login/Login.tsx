import './Login.css';
import React, { useState } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const enterEmailAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    return (
        <div className="login-page">
            <div className="login-body">
                <div className="login-left">
                    <h1 className="login-title">Login</h1>

                    <form className="login-email-field">
                        <input
                            type="text"
                            placeholder="E-Mail-Adresse..."
                            value={email}
                            onChange={enterEmailAdress}
                            className="login-email-field-input"
                        />
                    </form>

                    <form className="login-password-field">
                        <input
                            type="password"
                            placeholder="Passwort..."
                            value={password}
                            onChange={enterPassword}
                            className="login-password-field-input"
                        />
                    </form>

                    <a type="Submit" href="/" className="login-button">Anmelden</a>
                    <a type="Submit" href="/register" className="register-button">Registrieren</a>
                </div>

                <div className="login-right">
                    <img src="/../../public/images/Logo.jpg" alt="Logo" className="login-logo" />
                </div>
            </div>
        </div>
    )
};

export default Login;
