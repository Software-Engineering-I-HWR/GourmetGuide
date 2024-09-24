import React from 'react';
import './error-page.css';

const errorPage: React.FC = () => {
    return (
        <footer className="errorPage">
            <p className="errorPage__text"> Fehler: Die seite die sie Aufrufen gibt es nicht.</p>
        </footer>
    );
};

export default errorPage;
