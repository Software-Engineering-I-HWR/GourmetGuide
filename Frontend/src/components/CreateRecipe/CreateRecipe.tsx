import "./CreateRecipe.css"
import React, {useEffect, useState} from 'react';
import PopupWindow from "../../PopupWindow.tsx";
import {useParams} from "react-router-dom";

interface Category {
    Category: string;
}

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

    async function getAllCategories(): Promise<Category[] | null> {
        try {
            const response = await fetch('https://canoob.de:3007/getAllCategories');
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

    // Handle form submission (you can adapt this to save/submit the recipe data to a server)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newRecipe = {
            title: title,
            steps: description,
            image: imageUrl,
            ingredients: ingredientsList.join("|"),
            creator: localStorage.getItem('userEmail'),
            difficulty: null,
            category: selectedCategory,
            vegan: null,
            vegetarian: null,
            allergen: null,
        };

        const response: Response = await fetch('https://canoob.de:3007/saveRecipe', {
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
                        <ul className="ingredients-list">
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
                        </ul>
                        <button type="submit" className="submit-recipe-button">
                            Submit Recipe
                        </button>
                        {createRecipeMessage && <p className="create-recipe-message">{createRecipeMessage}</p>}
                    </form>
                </div>
            </div>
        ));

};


export default CreateRecipe;
