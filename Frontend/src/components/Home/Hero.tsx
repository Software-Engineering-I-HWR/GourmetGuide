import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <header className="hero">
            <div className="hero__content">
                <h1 className="hero__title">Willkommen bei GourmetGuide: Gaumenschmaus!</h1>
                <p className="hero__subtitle">Entdecke und teile coole Rezepte.</p>
            </div>
        </header>
    );
};

export default Hero;