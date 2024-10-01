import './Register.css';
import React, {useState} from 'react';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');

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
                const response = await fetch('http://canoob.de:30156/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                });

                if (response.status === 200) {

                    setRegisterMessage('Registrieren erfolgreich!');

                }

                if (response.status === 500) {
                    setRegisterMessage('User Existiert schon');
                }

            } catch (error) {
                console.error(error);
                setRegisterMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'); // Display error message
            }

        } else {
            setRegisterMessage('Unterschiedliche Passwörter eingegeben')
        }
    }

    return (
        <div className="register-page">
            <div className="register-body">
                <div className="register-left">
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

                    <form className="register-password-repeat-field" onSubmit={handleRegister}>
                        <button type="submit" className="login-button">Registrieren</button>
                    </form>

                    {/* Render the login message */}
                    {registerMessage && <p className="register-message">{registerMessage}</p>}

                </div>

                <div className="register-right">
                    <img src="/../../public/images/Logo.jpg" alt="Logo" className="login-logo"/>
                </div>

            </div>
        </div>
    )
};

export default Register;