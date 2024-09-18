import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
    const navLinks = [
        { name: 'Kategorien', path: '/kategorien' },
        { name: 'Login', path: '/log-in' },
    ];

    const sampleRecipes = [
        { title: 'Spaghetti Carbonara', description: 'Ein klassisches italienisches Gericht.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Pizzateig', description: 'Das beste Rezept für einen knusprigen Pizzateig.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Gemüselasagne', description: 'Schnelles und gesundes Mittagessen.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
    ];

    return (
        <div>
            <Navbar title="GourmetGuide" links={navLinks} />
            <Hero />
            <main className="main-content">
                <section className="recipes">
                    <h2 className="recipes__title">Aktuelle Rezepte</h2>
                    <div className="recipes__list">
                        {sampleRecipes.map((recipe, index) => (
                            <RecipeCard key={index} {...recipe} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default App;
