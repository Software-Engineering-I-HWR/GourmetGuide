import "./CreateRecipe.css"
import React, {useEffect, useState} from 'react';
import PopupWindow from "../../PopupWindow.tsx";
import {useParams} from "react-router-dom";
import configData from '../../../../config/config.json';

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

const dietaryTags = ["Vegan", "Vegetarisch", "Glutenfrei", "Nussfrei", "Eifrei", "Lactosefrei"];

const CreateRecipe: React.FC = () => {
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
            const response = await fetch('https://' + hostData.host + ':3007/getAllCategories');
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

        if (selectedTags.includes("Vegetarisch")){
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

        const response: Response = await fetch('https://' + hostData.host + ':3007/saveRecipe', {
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
        (
            <div className="create-recipe-page">
                {showPopupMessage && (
                    <PopupWindow message={createRecipeMessage}/>
                )}
                <div className="create-recipe-body">
                    <h1 className="create-recipe-title">Erstelle dein eigenes Rezept!</h1>


                    <div className="tag-section">
                        <h3>Allergene auswählen</h3>
                        <div className="tag-buttons">
                            {dietaryTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Display selected tags */}
                        {selectedTags.length > 0 && (
                            <div className="selected-tags">
                                <h4>Tags:</h4>
                                {selectedTags.map(tag => (
                                    <span key={tag} className="selected-tag">
                                    {tag}
                                </span>
                                ))}
                            </div>
                        )}
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


                    <form onSubmit={handleSubmit}>
                        <div className="recipe-field">
                            <label>Titel</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Gib den Titel des Rezepts ein..."
                                required
                            />
                        </div>
                        <div className="recipe-field">
                            <label>Beschreibung</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Gib die Beschreibung des Rezepts ein..."
                                required
                            ></textarea>
                        </div>
                        <div className="recipe-field">
                            <label>Bildlink</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Gib ein Link zu dem Bild deines Rezeptes an..."
                            />
                            {imageUrl && <img src={imageUrl} alt="Ungültiger Link..." className="image-preview"/>}
                        </div>
                        <div className="category-dropdown">
                            <label>Kategorie</label>
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
                        <div className="recipe-field">
                            <label>Zutaten</label>
                            <div className="ingredient-input-wrapper">
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => setIngredient(e.target.value)}
                                    placeholder="Gib eine Zutat an und füge sie mit '+' hinzu..."
                                />
                                <button
                                    type="button"
                                    className="add-ingredient-button"
                                    onClick={handleAddIngredient}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="ingredients-list">
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

                        <button type="submit" className="submit-recipe-button">
                            Rezept einsenden
                        </button>
                        {createRecipeMessage && <p className="create-recipe-message">{createRecipeMessage}</p>}
                    </form>
                </div>
            </div>
        ));

};


export default CreateRecipe;
