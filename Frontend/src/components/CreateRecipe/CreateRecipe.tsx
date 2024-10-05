import "./CreateRecipe.css"
import React, {useState} from 'react';

interface Recipe {
    title: string;
    description: string;
    imageUrl: string;
    ingredients: string[];
}

const CreateRecipe: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [ingredient, setIngredient] = useState<string>(''); // For individual ingredient input
    const [ingredientsList, setIngredientsList] = useState<string[]>([]); // List of added ingredients

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
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const newRecipe: Recipe = {
            title,
            description,
            imageUrl,
            ingredients: ingredientsList,
        };

        console.log('New Recipe:', newRecipe);
        // You can add an API call here to submit the new recipe data
    };

    return (
        (
            <div className="create-recipe-page">
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
                    </form>
                </div>
            </div>
        ));

};


export default CreateRecipe;
