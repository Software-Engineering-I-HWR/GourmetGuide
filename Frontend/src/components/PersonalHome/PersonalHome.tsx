import "./PersonalHome.css";
import React, {useEffect, useState} from "react";
import Hero from "../Home/Hero.tsx";
import configData from '../../../../config/frontend-config.json';

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

interface ListItem2 {
    title: string;
    category: string;
    imageUrl: string;
    id: number;
}

const hostData: Config = configData;

const PersonalHome: React.FC = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [whichIsDisable, setWhichIsDisable] = useState(0);
    const [ownRecipes, setOwnRecipes] = useState<ListItem[]>([]);
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const [recipeIds2, setRecipeId2s] = useState<number[]>([]);
    const [ratedRecipes, setRatedRecipes] = useState<ListItem2[]>([]);
    const username = localStorage.getItem("userEmail");

    const [bookmarkRecipesIDs, setBookmarkRecipesIDs] = useState<number[]>([]);
    const [bookmarkRecipes, setBookmarkRecipes] = useState<ListItem[]>([]);

    async function getRecipes(id: number): Promise<Recipe | null> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getRecipeByID?id=${encodeURIComponent(id)}`,
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
                `https://` + hostData.host + `:30155/getRecipesByUser?user=${encodeURIComponent(username!)}`,
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

    async function getBookmarkedRecipes() {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getBookmarkedRecipesByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const indexes = await response.json();
                const ids = indexes.map((item: { ID: number }) => item.ID)
                setBookmarkRecipesIDs(ids);
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
                `https://` + hostData.host + `:30155/getRatedRecipesByUser?user=${encodeURIComponent(username!)}`,
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
            getBookmarkedRecipes();
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
                }
            }
            setOwnRecipes(loadedRecipes);
        };

        if (recipeIds.length > 0) {
            fetchRecipes2();
        }
    }, [recipeIds]);

    useEffect(() => {
        const fetchRecipes3 = async () => {
            const loadedRecipes: ListItem[] = [];

            for (const id of bookmarkRecipesIDs) {
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

            setBookmarkRecipes(loadedRecipes);
        };

        if (bookmarkRecipesIDs.length > 0) {
            fetchRecipes3();
        }
    }, [bookmarkRecipesIDs]);


    async function handleDeleteRecipe(id: number) {
        const confirmed = window.confirm("Möchten Sie dieses Rezept wirklich löschen?");
        if (!confirmed) return;

        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/deleteRecipeByID?id=${encodeURIComponent(id)}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("Rezept wurde erfolgreich gelöscht.");
                setOwnRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
            } else if (response.status === 404) {
                alert("Rezept wurde nicht gefunden!");
            } else {
                alert(`Fehler beim Löschen des Rezepts: ${response.statusText}`);
            }
        } catch (error) {
            alert("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
            console.error("Network error:", error);
        }
    }


    return (
        <div className="personalHome">
            <Hero
                title="Privater Bereich"
                subtitle="Hier sehen Sie Ihre Rezepte und die Rezepte, die Sie bewertet haben!"
            />
            <div className="personalHome-main">
                {showMobileMenu && <div className="ownPage-actions-mobile">

                    <button className="ownPage-mobile-menu-buttons" onClick={() => {
                        setShowMobileMenu(false);
                        setWhichIsDisable(0);
                    }}>Eigene Rezepte
                    </button>
                    <button className="ownPage-mobile-menu-buttons" onClick={() => {
                        setShowMobileMenu(false);
                        setWhichIsDisable(1);
                    }}>Bewertete Rezepte
                    </button>
                    <button className="ownPage-mobile-menu-buttons" onClick={() => {
                        setShowMobileMenu(false);
                        setWhichIsDisable(2);
                    }}>Bookmarks
                    </button>
                </div>}
                <div className="personalHome-main-head">
                    <img src="/images/menu.png" alt="Menü Button Mobile" className="menu-button-mobile-categories"
                         onClick={() => setShowMobileMenu(!showMobileMenu)}/>
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
                        <button
                            className="personalHome-ownRecipes"
                            onClick={() => setWhichIsDisable(2)}
                            value={whichIsDisable === 2 ? "enable" : "disable"}
                        >
                            Bookmarks
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
                                    <th scope="col5">Löschen</th> {/* Added a new column for actions */}
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
                                        <td>
                                            {/* Add Delete Button Here */}
                                            <button className="delete-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRecipe(recipe.id);
                                                }}
                                            >
                                                <img src="/images/delete.png" alt="Delete recipe" className="delete-icon" />
                                            </button>
                                        </td> {/* Added delete button */}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {whichIsDisable === 0 && ownRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch kein Rezept erstellt!</div>
                    )}
                    {whichIsDisable === 2 && bookmarkRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch keine Bookmarks!</div>
                    )}
                    {whichIsDisable === 2 && bookmarkRecipes.length !== 0 && (
                        <div className="home-recipes-table"
                             style={bookmarkRecipes.length == 1 ? {marginBottom: "30%"} : bookmarkRecipes.length == 2 ? {marginBottom: "20%"} : bookmarkRecipes.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
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
                                {bookmarkRecipes.map((recipe, index) => (
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
                    {whichIsDisable === 1 && (ratedRecipes.length !== 0 ? (
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
                    ) :  (<div className="home-recipes-error">Du hast noch keine Rezepte bewertet!</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalHome;
