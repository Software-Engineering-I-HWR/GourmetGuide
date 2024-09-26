import Hero from './Hero.tsx';
import RecipeCard from './RecipeCard.tsx';
import './../../App.css';


const Home: React.FC = () => {
    const sampleRecipes = [
        { title: 'Spaghetti Carbonara', description: 'Ein klassisches italienisches Gericht.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Pizzateig', description: 'Das beste Rezept für einen knusprigen Pizzateig.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Gemüselasagne', description: 'Schnelles und gesundes Mittagessen.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Tiramisu', description: 'Ein himmlisches Dessert aus Italien.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Griechischer Salat', description: 'Ein frischer Salat mit Tomaten, Gurken, Feta und Oliven.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Chicken Curry', description: 'Ein würziges indisches Gericht mit Huhn und aromatischen Gewürzen.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Guacamole', description: 'Eine cremige Avocado-Dip aus Mexiko.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Pancakes', description: 'Fluffige Pancakes zum Frühstück oder Brunch.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Shakshuka', description: 'Ein herzhaftes Frühstück aus pochierten Eiern in Tomatensauce.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' },
        { title: 'Quiche Lorraine', description: 'Ein klassischer französischer Kuchen mit Speck und Käse.', imageUrl: 'https://www.publicdomainpictures.net/pictures/40000/nahled/sky-blue-1359435411mV0.jpg' }
    ];

    return (
        <div>
            <Hero/>
            <main className="main-content">
                <section className="recipes">
                    <h2 className="recipes__title">Aktuelle Rezepte</h2>
                    <div className="recipes__list">
                        {sampleRecipes!.map((recipe, index) => (
                            <RecipeCard key={index} {...recipe} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}


export default Home;
