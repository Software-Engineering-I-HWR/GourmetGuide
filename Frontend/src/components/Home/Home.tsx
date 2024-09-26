
import React from 'react';
import Hero from './Hero.tsx';
import RecipeCard from './RecipeCard.tsx';
import './../../App.css';

interface ListItem {
    title: string;
    description: string;
    imageUrl: string;
}

const Home: React.FC = () => {
    /*const sampleRecipes = [
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
    ];*/
    const sampleRecipes = await test();


    async function getRecipes() {
        try {
            const response = await fetch('http://canoob.de:3007/getRecipes');
            if (response.ok) {
                const data = await response.json();
                //console.log('Daten von der API:', data);
                return data;
            } else {
                console.error('Fehler bei der API-Anfrage:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Netzwerkfehler:', error);
            return null;
        }
    }

    async function test() {
        const recipes = await getRecipes();
        // const [firstFifteenRecipes, setFirstFifteenRecipes] = useState<any[]>([]);
        const firstFifteenRecipes: ListItem[] = [];
        let i = recipes.length - 1;
        if (recipes && Array.isArray(recipes)) {
            while (i > recipes.length - 16) {
                const newItem: ListItem = {
                    title: (`${recipes[i].Title}`),
                    description: (`${recipes[i].Category}`),
                    imageUrl: (`${recipes[i].Image}`)
                };
                firstFifteenRecipes.push(newItem);
                //firstFifteenRecipes = [...firstFifteenRecipes, [(`${recipes[i].Title}`), (`${recipes[i].Category}`), (`${recipes[i].Image}`)]];
                i = i - 1;
            }
            console.log(firstFifteenRecipes);
            console.log(sampleRecipes);
            /*recipes.forEach(recipe => {
               // console.log('Verarbeite Rezept:', recipe);
                // Zugriff auf spezifische Felder jedes Rezepts
                console.log(`ID: ${recipe.ID}`);
                console.log(`Titel: ${recipe.Title}`);
                /*console.log(`Bild: ${recipe.Image}`);
                console.log(`Zutaten: ${recipe.Ingredients}`);
                console.log(`Zubereitungsschritte: ${recipe.Steps}`);
                console.log(`Kategorie: ${recipe.Category}`);
            });*/
            return firstFifteenRecipes;
        } else {
            console.error('Keine gültigen Rezepte erhalten oder die Daten sind kein Array.');
            return null;
        }
    }


    return (
        <div>
            <Hero />
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
};



export default Home;
