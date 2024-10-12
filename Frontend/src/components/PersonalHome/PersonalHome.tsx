import "./PersonalHome.css";
import React, {useEffect, useState} from "react";
import Hero from "../Home/Hero.tsx";

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
    id: number;
}

interface ListItem2 {
    title: string;
    category: string;
    imageUrl: string;
    id: number;
}

const PersonalHome: React.FC = () => {
    const [whichIsDisable, setWhichIsDisable] = useState(0);
    const [ownRecipes, setOwnRecipes] = useState<ListItem[]>([]);
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const [recipeIds2, setRecipeId2s] = useState<number[]>([]);
    const [ratedRecipes, setRatedRecipes] = useState<ListItem2[]>([]);
    const username = localStorage.getItem("userEmail");

    async function getRecipes(id: number): Promise<Recipe | null> {
        try {
            const response = await fetch(
                `https://canoob.de:3007/getRecipeByID?id=${encodeURIComponent(id)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                return await response.json();
            } else {
                console.error("API request error:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
            return null;
        }
    }

    // Funktion zum Abrufen der eigenen Rezept-IDs des Benutzers
    async function getOwnRecipes(): Promise<void> {
        try {
            const response = await fetch(
                `https://canoob.de:3007/getRecipesByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const indexes = await response.json();
                const ids = indexes.map((item: { ID: number }) => item.ID);
                setRecipeIds(ids);
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async function getRatedRecipes(): Promise<void> {
        try {
            const response = await fetch(
                `https://canoob.de:3007/getRatedRecipesByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const indexes = await response.json();
                const ids = indexes.map((item: { ID: number }) => item.ID);
                setRecipeId2s(ids);
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    useEffect(() => {
        if (username) {
            getOwnRecipes();
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            getRatedRecipes();
        }
    }, [username]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const loadedRecipes: ListItem[] = [];

            for (const id of recipeIds2) {
                const recipe = await getRecipes(id);
                if (recipe && Array.isArray(recipe)) {
                    const newRecipe: ListItem = {
                        title: recipe[0].Title,
                        category: recipe[0].Category,
                        imageUrl: recipe[0].Image,
                        id: recipe[0].ID,
                    };
                    loadedRecipes.push(newRecipe);
                    console.log(loadedRecipes);
                }
            }
            setRatedRecipes(loadedRecipes);
        };

        if (recipeIds2.length > 0) {
            fetchRecipes();
        }
    }, [recipeIds2]);

    useEffect(() => {
        const fetchRecipes2 = async () => {
            const loadedRecipes: ListItem[] = [];

            for (const id of recipeIds) {
                const recipe = await getRecipes(id);
                if (recipe && Array.isArray(recipe)) {
                    const newRecipe: ListItem = {
                        title: recipe[0].Title,
                        category: recipe[0].Category,
                        imageUrl: recipe[0].Image,
                        id: recipe[0].ID,
                    };
                    loadedRecipes.push(newRecipe);
                    console.log(loadedRecipes);
                }
            }
            setOwnRecipes(loadedRecipes);
        };

        if (recipeIds.length > 0) {
            fetchRecipes2();
        }
    }, [recipeIds]);

    return (
        <div className="personalHome">
            <Hero
                title="Privater Bereich"
                subtitle="Hier sehen Sie Ihre Rezepte und die Rezepte, die sie bewertet haben!"
            />
            <div className="personalHome-main">
                <div className="personalHome-main-head">
                    <button
                        className="personalHome-main-head__button"
                        onClick={() => (window.location.href = "/create-recipe")}
                    >
                        Rezept erstellen
                    </button>
                </div>
                <div className="personalHome-main-div">
                    <div className="personalHome-choose-buttons">
                        <button
                            className="personalHome-ownRecipes"
                            onClick={() => setWhichIsDisable(0)}
                            value={whichIsDisable === 0 ? "enable" : "disable"}
                        >
                            Eigene Rezepte
                        </button>
                        <button
                            className="personalHome-ratedRecipes"
                            onClick={() => setWhichIsDisable(1)}
                            value={whichIsDisable === 1 ? "enable" : "disable"}
                        >
                            Bewertete Rezepte
                        </button>
                    </div>
                    {whichIsDisable === 0 && ownRecipes.length !== 0 && (
                        <div className="home-recipes-table"
                             style={ownRecipes.length == 1 ? {marginBottom: "30%"} : ownRecipes.length == 2 ? {marginBottom: "20%"} : ownRecipes.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
                            <table className="recipes-table">
                                <thead>
                                <tr>
                                    <th scope="col1">#</th>
                                    <th scope="col2">Titel</th>
                                    <th scope="col3">Kategorie</th>
                                    <th scope="col4">Bild</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ownRecipes.map((recipe, index) => (
                                    <tr
                                        key={recipe.id} // Verwende die ID als eindeutigen Schlüssel
                                        onClick={() => (window.location.href = `/recipe/${recipe.id}/`)}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{recipe.title}</td>
                                        <td>{recipe.category}</td>
                                        <td>
                                            <img
                                                src={recipe.imageUrl}
                                                style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                                alt="Bild Rezept"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {whichIsDisable === 0 && ownRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch kein Rezept erstellt!</div>
                    )}

                    {whichIsDisable === 1 && ratedRecipes.length !== 0 && (
                        <div className="home-recipes-table"
                             style={ratedRecipes.length == 1 ? {marginBottom: "30%"} : ratedRecipes.length == 2 ? {marginBottom: "20%"} : ratedRecipes.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
                            <table className="recipes-table">
                                <thead>
                                <tr>
                                    <th scope="col1">#</th>
                                    <th scope="col2">Titel</th>
                                    <th scope="col3">Kategorie</th>
                                    <th scope="col4">Bild</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ratedRecipes.map((recipe, index) => (
                                    <tr
                                        key={recipe.id} // Verwende die ID als eindeutigen Schlüssel
                                        onClick={() => (window.location.href = `/recipe/${recipe.id}/`)}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{recipe.title}</td>
                                        <td>{recipe.category}</td>
                                        <td>
                                            <img
                                                src={recipe.imageUrl}
                                                style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                                alt="Bild Rezept"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {whichIsDisable === 1 && ownRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch keine Rezepte bewertet!</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalHome;
