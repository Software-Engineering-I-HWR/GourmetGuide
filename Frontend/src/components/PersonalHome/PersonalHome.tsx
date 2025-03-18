import "./PersonalHome.css";
import React, {useEffect, useState} from "react";
import Hero from "../Home/Hero.tsx";
import configData from '../../../../config/frontend-config.json';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

interface NewRecipeItem {
    creator: string;
    category: string;
    title: string;
    imageUrl: string;
    id: number;
}

interface NewRecipeItemFromDB {
    Creator: string;
    Category: string;
    Title: string;
    Image: string;
    ID: number;
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

interface PersonalHomeProps {
    showPoint: boolean;
    setShowPoint: (showPoint: boolean) => void;
}

const hostData: Config = configData;

const PersonalHome: React.FC<PersonalHomeProps> = ({showPoint, setShowPoint}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [whichIsDisable, setWhichIsDisable] = useState(1);
    const [ownRecipes, setOwnRecipes] = useState<ListItem[]>([]);
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const [recipeIds2, setRecipeId2s] = useState<number[]>([]);
    const [ratedRecipes, setRatedRecipes] = useState<ListItem2[]>([]);
    const username = localStorage.getItem("userEmail");
    const [newRecipes, setNewRecipes] = useState<NewRecipeItem[]>([/*{id: 86, category: "Auflauf", title: "Gemüselasagne", imageUrl:"https://www.koch-mit.de/app/uploads/2019/07/AdobeStock_174308075.jpeg", creator:"GourmetGuide Team"}*/]);

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

    async function getLastLogin() {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getLastLoginByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async function setlastLogin() {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/setLastLoginByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "POST",
                }
            );
            if (response.ok) {
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

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

    useEffect(() => {
        getLastLogin()
    }, []);

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

    async function getNewRecipes(): Promise<NewRecipeItemFromDB[] | null> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getNewRecipesByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const recipes = await response.json();
                return recipes;
            } else {
                console.error("API request error:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
            return null;
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
        const fetchNewRecipes = async () => {
            const loadedRecipes: NewRecipeItem[] = [];
            const newRecipes: NewRecipeItemFromDB[] | null = await getNewRecipes();

            if (newRecipes) {
                for (const i of newRecipes) {
                    const newRecipe: NewRecipeItem = {
                        title: i.Title,
                        category: i.Category,
                        imageUrl: i.Image,
                        id: i.ID,
                        creator: i.Creator
                    };
                    loadedRecipes.push(newRecipe);
                }
            }
            setNewRecipes(loadedRecipes);
            if (newRecipes!.length > 0) {
                setShowPoint(true)
            }
        };

        fetchNewRecipes();
    }, []);

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
                            onClick={() => setWhichIsDisable(1)}
                            value={whichIsDisable === 1 ? "enable" : "disable"}
                        >
                            Eigene Rezepte
                        </button>
                        <button
                            className="personalHome-ratedRecipes"
                            onClick={() => setWhichIsDisable(2)}
                            value={whichIsDisable === 2 ? "enable" : "disable"}
                        >
                            Bewertete Rezepte
                        </button>
                        <button
                            className="personalHome-ownRecipes"
                            onClick={() => setWhichIsDisable(3)}
                            value={whichIsDisable === 3 ? "enable" : "disable"}
                        >
                            Bookmarks
                        </button>
                        <button
                            className="personalHome-ownRecipes position-relative"
                            onClick={() => {
                                setWhichIsDisable(0)
                                getNewRecipes()
                                setTimeout(() => {
                                    setlastLogin();
                                    setShowPoint(false)
                                }, 3000);
                            }}
                            value={whichIsDisable === 0 ? "enable" : "disable"}
                        >
                            Benachrichtigungen
                            {showPoint && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle p-2 bg-danger rounded-circle">
                                    <span className="visually-hidden">ungelesene Nachrichten</span>
                                </span>
                            )}
                        </button>
                    </div>
                    {whichIsDisable === 1 && ownRecipes.length !== 0 && (
                        <div className="home-recipes-table"
                             style={ownRecipes.length == 1 ? {marginBottom: "30%"} : ownRecipes.length == 2 ? {marginBottom: "20%"} : ownRecipes.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
                            <table className="recipes-table">
                                <thead>
                                <tr>
                                    <th scope="col1">#</th>
                                    <th scope="col2">Titel</th>
                                    <th scope="col3">Kategorie</th>
                                    <th scope="col4">Bild</th>
                                    <th scope="col6">Bearbeiten</th>
                                    <th scope="col5">Löschen</th>
                                    {/* Added a new column for actions */}
                                </tr>
                                </thead>
                                <tbody>
                                {ownRecipes.map((recipe, index) => (
                                    <tr
                                        key={recipe.id} // Verwende die ID als eindeutigen Schlüssel
                                        onClick={() => (window.location.href = `/recipe/${recipe.id}/`)}
                                    >
                                        <th scope="notification-row">{index + 1}</th>
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
                                            {/* Add Edit Button Here */}
                                            <button className="edit-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/create-recipe/${recipe.id}`
                                                    }}
                                            >
                                                <img src="/images/edit.png" alt="Edit recipe"
                                                     className="edit-icon"/>
                                            </button>
                                        </td>
                                        {/* Added Edit button */}
                                        <td>
                                            {/* Add Delete Button Here */}
                                            <button className="delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRecipe(recipe.id);
                                                    }}
                                            >
                                                <img src="/images/delete.png" alt="Delete recipe"
                                                     className="delete-icon"/>
                                            </button>
                                        </td>
                                        {/* Added delete button */}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {whichIsDisable === 0 && newRecipes.length != 0 && <div className="notification-row notification-container">
                        {newRecipes.map((a) => (
                            <div className="card notification-card notification-invitation">
                                <div className="card-body align-items-center">
                                    <table>
                                        <tbody> {/* tbody hinzugefügt für validen HTML-Code */}
                                        <tr className="align-items-center">
                                            <td style={{width: "65%"}}>
                                                <div className="card-title mb-0 fs-5">
                                                    {a.creator} hat ein neues Rezept hochgeladen:
                                                    <div className="fs-6 fw-normal ms-5"><b>Titel:</b> {a.title}</div>
                                                    <div className="fs-6 fw-normal ms-5"><b>Kategorie</b> {a.category}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{width: "30%"}}>
                                                <img style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "15vh",
                                                    height: "auto",
                                                    display: "block"
                                                }} src={a.imageUrl} alt="Neues Rezept - Bild"/>
                                            </td>
                                            <td style={{width: "5%"}}>
                                                <button className="btn btn-primary fs-6 p-1"
                                                        style={{backgroundColor: "#07546e", border: "none"}}
                                                        onClick={() => window.location.href = `/recipe/${a.id}/`}>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>}

                    {whichIsDisable === 0 && newRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast keine Benachrichtigungen!</div>
                    )}

                    {whichIsDisable === 1 && ownRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch kein Rezept erstellt!</div>
                    )}
                    {whichIsDisable === 3 && bookmarkRecipes.length === 0 && (
                        <div className="home-recipes-error">Du hast noch keine Bookmarks!</div>
                    )}
                    {whichIsDisable === 3 && bookmarkRecipes.length !== 0 && (
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
                                        <th scope="notification-row">{index + 1}</th>
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
                    {whichIsDisable === 2 && (ratedRecipes.length !== 0 ? (
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
                                        <th scope="notification-row">{index + 1}</th>
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
                    ) : (<div className="home-recipes-error">Du hast noch keine Rezepte bewertet!</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonalHome;
