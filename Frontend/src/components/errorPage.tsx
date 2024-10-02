import React from 'react';
import './error-page.css';

const ErrorPage: React.FC = () => {
    return (
        <footer className="errorPage">
            <p className="errorPage__text"> Fehler: Die Seite, die Sie aufrufen, gibt es nicht.</p>
        </footer>
    );
};

export default ErrorPage;
