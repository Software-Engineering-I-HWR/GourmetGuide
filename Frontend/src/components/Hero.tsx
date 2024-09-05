import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <header className="hero">
            <div className="hero__content">s
                <h1 className="hero__title">Willkommen bei Meine Rezeptseite!</h1>
                <p className="hero__subtitle">Entdecke, teile und genieße tolle Rezepte.</p>
                <a href="/rezepte" className="hero__button">Rezepte durchsuchen</a>
            </div>
        </header>
    );
};

export default Hero;