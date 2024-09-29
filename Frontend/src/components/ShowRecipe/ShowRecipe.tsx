import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';

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

interface ShowRecipeProps {
    id: number;
}

const ShowRecipe: React.FC<ShowRecipeProps> = ({id}) => {

    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`http://canoob.de:3007/getRecipeByID?={id}`);
            if (response.ok) {
                const recipes: Recipe[] = await response.json();
                console.log(recipes);
                return recipes;
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
        <footer className="errorPage">
            <button onClick={getRecipes}></button>
            <p className="errorPage__text"> Fehler: Die seite die sie Aufrufen gibt es nicht.</p>
        </footer>
    );
};

export default ShowRecipe;