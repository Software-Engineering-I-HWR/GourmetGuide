import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number;
    Allergen: string;
    Ingredients: string;
    Steps: string;
    Vegan: boolean;
    Vegetarian: boolean;
}

interface ListItem {
    title: string;
    category: string;
    imageUrl: string;
    id: number
    allergen: string;
    ingredients: string;
    steps: string;
    vegan: boolean;
    vegetarian: boolean;
}

const extractString = (str: string, startMarker: string, endMarker: string): string => {
    const startIndex = str.indexOf(startMarker);
    if (startIndex === -1) return ""; // Falls Startmarkierung nicht gefunden wird

    const start = startIndex + startMarker.length;
    const endIndex = str.indexOf(endMarker, start);
    if (endIndex === -1) return ""; // Falls Endmarkierung nicht gefunden wird

    return str.substring(start, endIndex);
};


const ShowRecipe: React.FC = () => {
    const [sampleRecipe, setSampleRecipe] = useState<ListItem | undefined>(undefined);
    const location = useLocation();
    const id = extractString(location.pathname, "recipe/", "/")
    const [ingredientsAsArray, setIngredientsAsArray] = useState<string[]>([]);
    const [stepssAsArray, setStepsAsArray] = useState<string[]>([]);

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

    const formatIngredients = (ingredientsAsString: string) => {
        const ingredientsArray: string[] = []; // Temporäres Array zur Speicherung der Zutaten
        let ingredientStartIndex = 0;

        for (let i = 0; i < ingredientsAsString.length; i++) {
            if (ingredientsAsString[i] === "|") {
                const newIngredientToAdd: string = ingredientsAsString.substring(ingredientStartIndex, i).trim(); // Trimmen, um Leerzeichen zu entfernen
                ingredientsArray.push(newIngredientToAdd); // Füge die neue Zutat zum temporären Array hinzu
                ingredientStartIndex = i + 1;
            }
        }

        // Füge das letzte Element nach der Schleife hinzu
        const lastIngredient = ingredientsAsString.substring(ingredientStartIndex).trim();
        if (lastIngredient) {
            ingredientsArray.push(lastIngredient);
        }

        // Aktualisiere den Zustand mit dem neuen Array
        setIngredientsAsArray(ingredientsArray);
    };

    const formatSteps = (stepsAsString: string) => {
        const stepsArray: string[] = []; // Temporäres Array zur Speicherung der Zutaten
        let stepStartIndex = 0;

        for (let i = 0; i < stepsAsString.length; i++) {
            if (stepsAsString[i] === ".") {
                const newStepToAdd: string = stepsAsString.substring(stepStartIndex, i + 1).trim(); // Trimmen, um Leerzeichen zu entfernen
                stepsArray.push(newStepToAdd); // Füge die neue Zutat zum temporären Array hinzu
                stepStartIndex = i + 1;
            }
        }

        // Füge das letzte Element nach der Schleife hinzu
        const lastStep = stepsAsString.substring(stepStartIndex).trim();
        if (lastStep) {
            stepsArray.push(lastStep);
        }

        // Aktualisiere den Zustand mit dem neuen Array
        setStepsAsArray(stepsArray);
    };


    useEffect(() => {
        const fetchRecipe = async () => {
            const recipe = await getRecipes();
            if (recipe && Array.isArray(recipe)) {
                const newRecipe: ListItem = {
                    title: recipe[0].Title,
                    category: recipe[0].Category,
                    imageUrl: recipe[0].Image,
                    id: recipe[0].ID,
                    allergen: recipe[0].Allergen,
                    ingredients: recipe[0].Ingredients,
                    steps: recipe[0].Steps,
                    vegan: recipe[0].Vegan,
                    vegetarian: recipe[0].Vegetarian
                };
                formatIngredients(newRecipe.ingredients);
                formatSteps(newRecipe.steps);
                setSampleRecipe(newRecipe);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };


        fetchRecipe();

    }, [getRecipes, id]);

    return (
        <body className="showRecipe">
        <header className="showRecipe-hero">
            <div className="showRecipe-contentfield">
                <div className="showRecipe-contentfield-left">
                    <h1 className="showRecipe-title">{sampleRecipe?.title}</h1>
                    <p className="showRecipe-category">{sampleRecipe?.category}</p>
                </div>
                <div className="showRecipe-contentfield-right">
                    <div className="showRecipe-properties">
                        <p className="showRecipe-properties-vegetarian" style={{
                            color: "#b1c3cd",
                            fontSize: "2%"
                        }}>Vegetarisch: {sampleRecipe?.vegetarian === null ? "n.a." : sampleRecipe?.vegetarian}</p>
                        <p className="showRecipe-properties-vegan" style={{
                            color: "#b1c3cd",
                            fontSize: "2%"
                        }}>Vegan: {sampleRecipe?.vegan === null ? "n.a." : sampleRecipe?.vegan}</p>
                        <p className="showRecipe-properties-allergen"
                           style={{
                               color: "#b1c3cd",
                               fontSize: "2%"
                           }}>Allergene: {sampleRecipe?.allergen === null ? "n.a." : sampleRecipe?.allergen}</p>
                    </div>
                </div>
            </div>
        </header>
        <div className="showRecipe-main">
            <div className="showRecipe-main-head">
                <img className="hero__img" src={sampleRecipe?.imageUrl} alt={sampleRecipe?.title}/>
                <div className="showRecipe-properties-ingredients">
                    <h1 className="showRecipe-properties-ingredients-title"> Zutaten: </h1>
                    <div
                        className="showRecipe-properties-ingredients-map">{ingredientsAsArray.map((element, index) => (
                        <p key={index} className="recipes-ingredient" style={{fontSize: "120%"}}>{element}</p>
                    ))}</div>
                </div>
            </div>
            <div className="separator-line"></div>
            <div className="showRecipe-properties-steps">
                <h1 className="showRecipe-properties-step-title"> Zubereitung: </h1>
                <div className="showRecipe-properties-step">{stepssAsArray.map((element, index) => (
                    <p key={index} className="recipes-step" style={{fontSize: "120%"}}>{element}</p>
                ))}</div>
            </div>
        </div>
        </body>
    );
};

export default ShowRecipe;