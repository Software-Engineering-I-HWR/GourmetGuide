import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

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

const extractAfterTarget = (
    array: string[],
    target: string,
    stopAt: string
): string[] => {
    const result: string[] = [];

    // Nach dem Index des Zielstrings suchen
    const startIndex = array.indexOf(target);

    // Wenn das Ziel gefunden wurde, weitermachen
    if (startIndex !== -1) {
        // Beginne bei der nächsten Position nach dem Zielstring
        for (let i = startIndex + 1; i < array.length; i++) {
            // Wenn das Stoppzeichen erreicht wird, Schleife abbrechen
            if (array[i] === stopAt) break;

            // Andernfalls das aktuelle Element in das Ergebnisarray kopieren
            result.push(array[i]);
        }
    }

    return result;
};


const ShowRecipe: React.FC = () => {

    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);
    const location = useLocation();
    const id = extractAfterTarget(location.pathname,"recipe/", "/")
    console.log(id);

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`http://canoob.de:3007/getRecipeByID?id=${encodeURIComponent(id)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();
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