import React from 'react';
import './Hero.css';

interface HeroProps {
    title: string;
    subtitle: string;
}

const Hero: React.FC<HeroProps> = ({title, subtitle}) => {
    return (
        <header className="hero">
            <div className="hero__content">
                <h1 className="hero__title">{title}</h1>
                <p className="hero__subtitle">{subtitle}</p>
            </div>
        </header>
    );
};

export default Hero;