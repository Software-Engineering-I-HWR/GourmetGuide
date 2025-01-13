import "./CreateRecipe.css";
import React, {useEffect, useState} from 'react';

import configData from '../../../../config/frontend-config.json';
import {useParams} from "react-router-dom";
import PopupWindow from "../../PopupWindow.tsx";

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface Category {
    Category: string;
}

const hostData: Config = configData;


const CreateRecipe: React.FC = () => {
        const allergerns = ["glutenfrei", "lactosefrei", "eifrei", "nussfrei"];

        const [title, setTitle] = useState<string>('');
        const [description, setDescription] = useState<string>('');
        const [imageUrl, setImageUrl] = useState<string>('');
        const [ingredient, setIngredient] = useState<string>(''); // For individual ingredient input
        const [ingredientsList, setIngredientsList] = useState<string[]>([]); // List of added ingredients
        const [showPopupMessage, setShowPopupMessage] = useState(false);
        const [createRecipeMessage, setCreateRecipeMessage] = useState('');
        const selectedStringCategory = useParams<{ Category: string }>().Category || "none";
        const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory == "none" ? "" : selectedStringCategory));
        const [selectedTags, setSelectedTags] = useState<string[]>([]);
        const [difficulty, setDifficulty] = useState(3); // Initial difficulty value is 3

        async function getAllCategories(): Promise<Category[] | null> {
            try {
                const response = await fetch('https://' + hostData.host + ':30155/getAllCategories');
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

        const [categories, setCategories] = useState<string[]>([]);
        useEffect(() => {
            const fetchCategories = async () => {
                const allCategoriesJson = await getAllCategories();
                if (allCategoriesJson) {
                    const categoriesList = allCategoriesJson.map(item => item.Category);
                    setCategories(categoriesList);
                }
            };
            fetchCategories();
        }, []);

        const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDifficulty(parseInt(event.target.value, 10)); // Update difficulty value
        };

        // Add an ingredient to the list
        const handleAddIngredient = () => {
            if (ingredient.trim() !== '') {
                setIngredientsList([...ingredientsList, ingredient]);
                setIngredient(''); // Clear input after adding
            }
        };

        // Remove an ingredient from the list
        const handleRemoveIngredient = (index: number) => {
            const updatedIngredients = ingredientsList.filter((_, i) => i !== index);
            setIngredientsList(updatedIngredients);
        };

        const toggleTag = (tag: string) => {
            if (selectedTags.includes(tag)) {
                setSelectedTags(selectedTags.filter(t => t !== tag));
            } else {
                setSelectedTags([...selectedTags, tag]);
            }
        };

        // Handle form submission (you can adapt this to save/submit the recipe data to a server)
        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();

            let vegan = 0
            let vegetarian = 0

            if (selectedTags.includes("Vegan")) {
                vegan = 1
            }

            if (selectedTags.includes("Vegetarisch")) {
                vegetarian = 1
            }

            const newRecipe = {
                title: title,
                steps: description,
                image: imageUrl,
                ingredients: ingredientsList.join("|"),
                creator: localStorage.getItem('userEmail'),
                difficulty: difficulty,
                category: selectedCategory,
                vegan: vegan,
                vegetarian: vegetarian,
                allergen: selectedTags.filter(tag => tag !== "Vegan" && tag !== "Vegetarisch").join(", "),
            };

            const response: Response = await fetch('https://' + hostData.host + ':30155/saveRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.status === 200) {
                window.location.href = '/';
                setShowPopupMessage(true);
                setCreateRecipeMessage("Rezept erstellt!")
            }
            if (response.status === 500) {
                setCreateRecipeMessage("Ein Fehler ist aufgetreten...")
            }

        };

        return (
            <body className="showRecipe">
            {showPopupMessage && (
                <PopupWindow message={createRecipeMessage}/>
            )}
            <form onSubmit={handleSubmit}>
                <header className="showRecipe-hero">
                    <div className="showRecipe-contentfield">
                        <div className="showRecipe-contentfield-left">
                            <h1 className="create-recipe-title">Erstelle dein eigenes Rezept!</h1>
                            <div className="showRecipe-title">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Gib den Titel des Rezepts ein..."
                                    required
                                />
                            </div>
                            <div className="showRecipe-category">
                                <select
                                    className="category-dropdown"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Keine Kategorie ausgewählt</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="showRecipe-contentfield-right">
                            <div className="showRecipe-properties">
                                <img className={"allergen-symbol"}
                                     src='/images/vegetarian.png'
                                     alt="vegetarisch-Symbol"
                                     title={"Vegetarisch"}
                                     onClick={() => toggleTag('Vegetarisch')}/>
                                <img className={"allergen-symbol"}
                                     src='/images/vegan.png'
                                     alt="vegan-symbol"
                                     title={"Vegan"}
                                     onClick={() => toggleTag('Vegan')}/>
                                {allergerns.map((item) => (
                                    <img className={"allergen-symbol"}
                                         src={`/images/${item.toLowerCase()}.png`}
                                         alt={`${item.toLowerCase()}-symbol`}
                                         onClick={() => toggleTag(item)}
                                         title={item}/>))}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="showRecipe-main">
                    <div className="showRecipe-main-head">
                        <img className="hero__img"
                             src={"https://s.yimg.com/uu/api/res/1.2/xy8jxuV2zpB956RYZ5b0hA--~B/Zmk9ZmlsbDtoPTQyMTt3PTY3NTthcHBpZD15dGFjaHlvbg--/https://s.yimg.com/os/creatr-uploaded-images/2021-02/572c4830-721d-11eb-bb63-96959c3b62f2.cf.jpg"}
                             alt={"Rezept Bild"}/>
                        <div className="showRecipe-properties-ingredients">
                            <h1 className="showRecipe-properties-ingredients-title"> Zutaten: </h1>
                            <div className="showRecipe-properties-ingredients-map">
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => setIngredient(e.target.value)}
                                    placeholder="Geben Sie eine Zutat an und füge Sie sie mit '+' hinzu..."
                                />
                                <button
                                    type="button"
                                    className="add-ingredient-button"
                                    onClick={handleAddIngredient}
                                >
                                    +
                                </button>
                            </div>
                            {ingredientsList.map((ing, index) => (
                                <li key={index}>
                                    {ing}
                                    <button
                                        type="button"
                                        className="remove-ingredient-button"
                                        onClick={() => handleRemoveIngredient(index)}
                                    >
                                        -
                                    </button>
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className="separator-line"></div>
                    <div className="showRecipe-properties-steps">
                        <h1 className="showRecipe-properties-step-title"> Zubereitung: </h1>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Gib die Beschreibung des Rezepts ein..."
                            required
                        ></textarea>
                    </div>

                    <div className="difficulty-slider-container">
                        {/* Label above the slider */}
                        <div className="difficulty-labels">
                            <span className="difficulty-label">Einfach</span>
                            <span className="difficulty-label">Mittel</span>
                            <span className="difficulty-label">Schwer</span>
                        </div>

                        {/* Slider with custom styling */}
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={difficulty}
                            onChange={handleSliderChange}
                            className="difficulty-slider"
                        />
                    </div>

                    <div className="separator-line"></div>
                    <p>Ersteller: Erstellername</p>
                </div>

                <button type="submit" className="submit-recipe-button">
                    Rezept einsenden
                </button>
                {createRecipeMessage && <p className="create-recipe-message">{createRecipeMessage}</p>}

            </form>
            </body>
        )
            ;
    }
;

export default CreateRecipe;