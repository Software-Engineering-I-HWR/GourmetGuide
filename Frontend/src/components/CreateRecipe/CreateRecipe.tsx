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
        const allergerns = ["Glutenfrei", "Lactosefrei", "Eifrei", "Nussfrei"];

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
        const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
        const [isCategoryEmpty, setIsCategoryEmpty] = useState<boolean>(false);
        const [isIngredientsEmpty, setIsIngredientsEmpty] = useState<boolean>(false);
        const [step, setStep] = useState<string>('');
        const [descriptionAsArray, setDescriptionAsArray] = useState<string[]>([]);
        const [isDescriptionEmpty, setIsDescriptionEmpty] = useState<boolean>(false);

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

        const handleAddStep = () => {
            if (step.trim() !== '') {
                setDescription(description + step + "|");
                setStep(''); // Clear input after adding
            }
        };

        useEffect(() => {
            formatSteps(description);
            description == "" ? setIsDescriptionEmpty(true) : setIsDescriptionEmpty(false);
        }, [description]);

        const toggleTag = (tag: string) => {
            if (selectedTags.includes(tag)) {
                setSelectedTags(selectedTags.filter(t => t !== tag));
            } else {
                setSelectedTags([...selectedTags, tag]);
            }
        };

        // Handle form submission (you can adapt this to save/submit the recipe data to a server)
        const handleSubmit = async (event: React.FormEvent) => {
            console.log("hier")
            event.preventDefault();

            if (!isTitleEmpty && !isCategoryEmpty && !isIngredientsEmpty && !isDescriptionEmpty) {
                setCreateRecipeMessage("Das Rezept konnte nicht gespeichert werden, da nicht alle Pflichtfelder (rot umrandet) ausgefüllt wurden!");
                console.log("hier2")

                return;
            }

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

        const formatSteps = (stepsAsString: string) => {
            const stepsArray: string[] = []; // Temporäres Array zur Speicherung der Zutaten
            let stepStartIndex = 0;

            for (let i = 0; i < stepsAsString.length; i++) {
                if (stepsAsString[i] === "|") {
                    const newStepToAdd: string = stepsAsString.substring(stepStartIndex, i); // Trimmen, um Leerzeichen zu entfernen
                    stepsArray.push(newStepToAdd); // Füge die neue Zutat zum temporären Array hinzu
                    stepStartIndex = i + 1;
                }
            }
            // Aktualisiere den Zustand mit dem neuen Array
            setDescriptionAsArray(stepsArray);
        };

        useEffect(() => {
            title.length > 0 ? setIsTitleEmpty(true) : setIsTitleEmpty(false);
        }, [title]);

        useEffect(() => {
            selectedCategory == "" ? setIsCategoryEmpty(true) : setIsCategoryEmpty(false);
        }, [selectedCategory]);

        useEffect(() => {
            ingredientsList.length > 0 ? setIsIngredientsEmpty(true) : setIsIngredientsEmpty(false);
        }, [ingredientsList]);

        return (
            <body className="showRecipe">
            {showPopupMessage && (
                <PopupWindow message={createRecipeMessage}/>
            )}
            <form onSubmit={handleSubmit}>
                <header className="showRecipe-hero" style={{color: '#98afbc'}}>
                    <div className="showRecipe-contentfield">
                        <div className="showRecipe-contentfield-left">
                            <h1 className="create-recipe-title">Erstelle dein eigenes Rezept!</h1>
                            <div className="showRecipe-title">
                                <input
                                    type="text"
                                    value={title}
                                    className={isTitleEmpty ? "input-field-reqired-filled" : "input-field-reqired-empty"}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Rezepttitel"
                                    required
                                />
                            </div>
                            <div className="showRecipe-category">
                                <select
                                    className={isCategoryEmpty ? "category-dropdown-empty" : "category-dropdown-filled"}
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    required
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
                            <p className={"allergen-instructions-empty"}>Bitte klicke die dem Rezept entsprechenden Allergen-Symbole an!</p>
                            <div className="showRecipe-properties">
                                <img
                                    className={selectedTags.includes('Vegetarisch') ? "allergen-symbol" : "allergen-symbol-grey"}
                                    src='/images/vegetarian.png'
                                    alt="vegetarisch-Symbol"
                                    title={"Vegetarisch"}
                                    onClick={() => toggleTag('Vegetarisch')}/>
                                <img
                                    className={selectedTags.includes('Vegan') ? "allergen-symbol" : "allergen-symbol-grey"}
                                    src='/images/vegan.png'
                                    alt="vegan-symbol"
                                    title={"Vegan"}
                                    onClick={() => toggleTag('Vegan')}/>
                                {allergerns.map((item) => (
                                    <img
                                        className={selectedTags.includes(item) ? "allergen-symbol" : "allergen-symbol-invert"}
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
                             src={"https://raw.githubusercontent.com/Software-Engineering-I-HWR/GourmetGuidePictures/refs/heads/main/2025-01-15-10-22-23.png"}
                             alt={"Rezept Bild"}/>
                        <div className="showRecipe-properties-ingredients">
                            <h1 className="showRecipe-properties-ingredients-title"> Zutaten: </h1>
                            <div className="showRecipe-properties-ingredients-map">
                                <input
                                    type="text"
                                    className={isIngredientsEmpty ? "ingredient-input-filled" : "ingredient-input-empty"}
                                    value={ingredient}
                                    onChange={(e) => setIngredient(e.target.value)}
                                    placeholder="Gib eine Zutat ein und füge Sie sie mit '+' hinzu..."
                                    required={!isIngredientsEmpty}
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
                                <div className="showRecipe-properties-ingredients-map" key={index}>
                                    {ing}
                                    <button
                                        type="button"
                                        className="remove-ingredient-button"
                                        onClick={() => handleRemoveIngredient(index)}
                                    >
                                        -
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="separator-line"></div>
                    <div className="showRecipe-properties-steps">
                        <h1 className="showRecipe-properties-step-title"> Zubereitung: </h1>
                        <div className="showRecipe-properties-step">{descriptionAsArray.map((element, index) => (
                            <p key={index} className="recipes-step" style={{fontSize: "120%"}}>{element}</p>
                        ))}</div>
                        <div className="step-row">
                            <input
                                type="text"
                                value={step}
                                className={isDescriptionEmpty ? "step-input-field-empty" : "step-input-field-filled"}
                                onChange={(e) => setStep(e.target.value)}
                                placeholder={isDescriptionEmpty ? "Gib den ersten Schritt des Rezepts ein und füge ihn mit '+' hinzu..." : "Gib den nächsten Schritt des Rezepts ein und füge ihn mit '+' hinzu..."}
                                required={isDescriptionEmpty}
                            ></input>
                            <button
                                type="button"
                                className="add-ingredient-button"
                                onClick={handleAddStep}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="difficulty-slider-container">
                        <p style={{marginBottom: "2%", marginTop: "2%"}} className={"allergen-instructions-empty"}>Bitte wähle die Schwierigkeit des Rezeptes aus!</p>
                        {/* Label above the slider */}
                        <div className="difficulty-labels">
                            <span className="difficulty-label">Sehr einfach</span>
                            <span className="difficulty-label">Mittel</span>
                            <span className="difficulty-label">Sehr schwer</span>
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
                    <p>Ersteller: {localStorage.getItem('userEmail')}</p>
                    <button type="submit" className="submit-recipe-button">
                        Rezept speichern
                    </button>
                    {createRecipeMessage && <p className="create-recipe-message">{createRecipeMessage}</p>}
                </div>

            </form>
            </body>
        )
            ;
    }
;

export default CreateRecipe;