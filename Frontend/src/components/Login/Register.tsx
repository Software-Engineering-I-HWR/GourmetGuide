import './register.css';
import React, {useState} from 'react';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const enterEmailAdress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const enterPasswordRepeat = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(event.target.value);
    }

    return (
        <div className="register-body">
            <h1 className="register-title">Registrieren</h1>

            <form className="register-email-field">
                <input
                    type="text"
                    placeholder="E-Mail-Addresse..."
                    value={email}
                    onChange={enterEmailAdress}
                    className="register-email-field-input"
                />
            </form>
            <form className="register-password-field">
                <input
                    type="text"
                    placeholder="Passwort..."
                    value={password}
                    onChange={enterPassword}
                    className="register-password-field-input"
                />
            </form>
            <form className="register-password-repeat-field">
                <input
                    type="text"
                    placeholder="Passwort wiederholen..."
                    value={passwordRepeat}
                    onChange={enterPasswordRepeat}
                    className="register-password-repeat-field-input"
                />
            </form>

            <a type="Submit" href="/" className="register-button">Registrieren</a>

        </div>)
};

export default Register;