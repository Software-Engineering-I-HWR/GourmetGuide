import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rezepte', path: '/rezepte' },
        { name: 'Über uns', path: '/ueber-uns' },
        { name: 'Kontakt', path: '/kontakt' },
    ];

    const sampleRecipes = [
        { title: 'Spaghetti Carbonara', description: 'Ein klassisches italienisches Gericht.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Chicken Curry', description: 'Würziges und aromatisches Hähnchencurry.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Vegetable Stir-Fry', description: 'Schnelle und gesunde Gemüsepfanne.', imageUrl: 'https://via.placeholder.com/150' },
    ];

    return (
        <div>
            <Navbar title="Meine Rezeptseite" links={navLinks} />
            <Hero />
            <main className="main-content">
                <section className="recipes">
                    <h2 className="recipes__title">Beliebte Rezepte</h2>
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
