import Hero from './Hero.tsx';
import RecipeCard from './RecipeCard.tsx';
import "./Home.css"
import React, {useEffect, useState} from "react";
import configData from '../../../../config/config.json';

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number
}

interface ListItem {
    title: string;
    description: string;
    imageUrl: string;
    id: number
}

const hostData: Config = configData;

const Home: React.FC = () => {
    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('http://' + hostData.host + ':3007/getRecipes');
            if (response.ok) {
                return await response.json();
            } else {
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipes = await getRecipes();
            if (recipes && Array.isArray(recipes)) {
                const lastFifteenRecipes = recipes.slice(-15).map(recipe => ({
                    title: recipe.Title,
                    description: recipe.Category,
                    imageUrl: recipe.Image,
                    id: recipe.ID
                }));
                setSampleRecipes(lastFifteenRecipes);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };


        fetchRecipes();
    }, []);

    return (
        <div>
            <Hero title="Willkommen bei GourmetGuide: Gaumenschmaus!" subtitle="Entdecke und teile coole Rezepte."/>
            <main className="main-content">
                <section className="recipes">
                    <h2 className="recipes__title"/>
                    <a className="recipes__list">
                        {sampleRecipes!.map((recipe, index) => (
                            <a
                                key={index}
                                className="recipes-link"
                                href={`/recipe/${recipe.id}/`}
                                style={{textDecoration: 'none'}}
                            >
                                <RecipeCard key={index} {...recipe} />
                            </a>
                        ))}
                    </a>
                </section>
            </main>
        </div>
    );
};

export default Home;
