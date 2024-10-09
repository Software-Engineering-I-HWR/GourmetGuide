import "./PersonalHome.css"
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
    const [ratedRecipes, setRatedRecipes] = useState<ListItem2[]>([]);
    const username = localStorage.getItem("userEmail")

    async function getOwnRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`https://canoob.de:3007/getRecipesByUser?user=${encodeURIComponent(username!)}`, {
                method: 'GET'
            });
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

    async function getRatedRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`https://canoob.de:3007/getRecipesByUser?user=${encodeURIComponent(username!)}`, {
                method: 'GET'
            });
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
        const fetchRecipe = async () => {
            const recipe = await getOwnRecipes();
            if (recipe && Array.isArray(recipe)) {
                const newRecipe: ListItem[] = recipe.map((item: Recipe) => ({
                    title: item.Title,
                    category: item.Category,
                    imageUrl: item.Image,
                    id: item.ID
                }));
                setOwnRecipes(newRecipe);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };
        fetchRecipe();
        console.log(ownRecipes);

    }, []);

    //useEffect einfügen, wenn die API-Funktion geschrieben wurde

    return (
        <div className="personalHome">
            <Hero title="Privater Bereich"
                  subtitle="Hier sehen Sie Ihre Rezepte und die Rezepte, die sie bewertet haben!"/>
            <div className="personalHome-main">
                <div className="personalHome-main-head">
                    <button className="personalHome-main-head__button"
                            onClick={() => window.location.href = "/create-recipe"}> Rezept erstellen
                    </button>
                </div>
                <div className="personalHome-main-div">
                    <div className="personalHome-choose-buttons">
                        <button className="personalHome-ownRecipes"
                                onClick={() => setWhichIsDisable(0)}
                                value={whichIsDisable === 0 ? "enable" : "disable"}> Eigene Rezepte
                        </button>
                        <button className="personalHome-ratedRecipes"
                                onClick={() => setWhichIsDisable(1)}
                                value={whichIsDisable === 1 ? "enable" : "disable"}> Bewertete Rezepte
                        </button>
                    </div>
                    {whichIsDisable === 0 && ownRecipes.length!=0 && (<div className="home-recipes-table">
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
                            {ownRecipes!.sort().map((recipe, index) => (
                                <tr onClick={() => window.location.href = `/recipe/${recipe.id}/`}>
                                    <th scope="row">{index}</th>
                                    <td>{recipe.title}</td>
                                    <td>{recipe.category}</td>
                                    <td>
                                        <img src={recipe.imageUrl}
                                             style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                             alt="Bild Rezept"/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>)}
                    {whichIsDisable === 0 && ownRecipes.length==0 && (<div className="home-recipes-error">
                        Du hast noch kein Rezept erstellt!
                    </div>)}

                    {whichIsDisable === 1 && ratedRecipes.length!=0 && (<div className="home-recipes-table">
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
                            {ratedRecipes!.sort().map((recipe, index) => (
                                <tr onClick={() => window.location.href = `/recipe/${recipe.id}/`}>
                                    <th scope="row">{index}</th>
                                    <td>{recipe.title}</td>
                                    <td>{recipe.category}</td>
                                    <td>
                                        <img src={recipe.imageUrl}
                                             style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                             alt="Bild Rezept"/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>)}
                    {whichIsDisable === 1 /*&& ownRecipes.length==0*/ && (<div className="home-recipes-error">
                        Du hast noch keine Rezepte bewertet!
                    </div>)}
                </div>
            </div>
        </div>
    );
}

export default PersonalHome;