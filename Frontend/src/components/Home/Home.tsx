import Hero from './Hero.tsx';
import RecipeCard from './RecipeCard.tsx';
import "./Home.css"
import React, {useEffect, useState} from "react";
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
    ID: number
    Rating: number;
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
    const [whichPage, setWhichPage] = useState<number>(0)
    const [animationClass, setAnimationClass] = useState<string>('');

    async function getHighRatedRecipes(): Promise<Recipe[] | null> {
        const promt = `https://` + hostData.host + `:30155/getFilteredRecipes` +
            `?name=` + `&` +
            `difficulty=` + `&` +
            `category=` + `&` +
            `ingredients=` + `&` +
            `vegetarian=` + `&` +
            `vegan=` + `&` +
            `allergens=` + `&` +
            `rating=` + `4`
        try {
            const response = await fetch(promt);
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

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('https://' + hostData.host + ':30155/getRecipes');
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
            if (whichPage === 1) {
                const recipes = await getRecipes();
                if (recipes && Array.isArray(recipes)) {
                    const lastFifteenRecipes = recipes.slice(-15).map(recipe => ({
                        title: recipe.Title,
                        description: recipe.Category,
                        imageUrl: recipe.Image,
                        id: recipe.ID,
                    }));
                    setSampleRecipes(lastFifteenRecipes);
                }
            } else if (whichPage === 0) {
                const recipes = await getHighRatedRecipes();
                if (recipes && Array.isArray(recipes)) {
                    const lastFifteenRecipes = recipes.sort((a, b) => b.Rating - a.Rating).slice(-15).map(recipe => ({
                        title: recipe.Title,
                        description: recipe.Category,
                        imageUrl: recipe.Image,
                        id: recipe.ID,
                    }));
                    setSampleRecipes(lastFifteenRecipes);
                }
            }
        };

        // Fade-Out (vor dem Fetch) und Fade-In (nach dem Fetch)
        setAnimationClass('fade-out');
        setTimeout(() => {
            fetchRecipes().then(() => {
                setAnimationClass('fade-in');  // Setze nach dem Laden der neuen Rezepte das Fade-In
            });
        }, 500); // Zeit passend zur CSS-Animation (0.5s)
    }, [whichPage]);

    function nextPage() {
        if (whichPage < 1) {
            setWhichPage(whichPage + 1);
        }
    }

    function prevPage() {
        if (whichPage > 0) {
            setWhichPage(whichPage - 1)
        }
    }

    return (
        <div>
            <Hero title="Willkommen bei GourmetGuide: Gaumenschmaus!" subtitle="Entdecke und teile coole Rezepte."/>
            <main className="main-content">
                <section className="recipes">
                    <div className="row justify-content-center align-items-center">
                        <button
                            className="navigation-button w-auto"
                            onClick={prevPage}
                            disabled={whichPage === 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '2rem',
                                cursor: whichPage > 0 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-arrow-left-circle p-0" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                            </svg>
                        </button>
                        <h2 className="recipes__title m-5 w-50 text-center">{whichPage == 0 ? "Beliebteste Rezepte" : "Neuste Rezepte"}</h2>
                        <button
                            className="navigation-button w-auto h-auto"
                            onClick={nextPage}
                            disabled={whichPage === 1}
                            style={{
                                background: 'none',
                                border: "none",
                                fontSize: '2rem',
                                cursor: whichPage < 1 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div
                        className={`recipes__container ${animationClass}`}
                        style={{display: 'flex', alignItems: 'center'}}
                    >                        {/* Recipes List */}
                        <div className="recipes__list" style={{flex: 1, display: 'flex', overflowX: 'auto'}}>
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
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
