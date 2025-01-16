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
        const [ingredient, setIngredient] = useState<string>('');
        const [ingredientsList, setIngredientsList] = useState<string[]>([]);
        const [showPopupMessage, setShowPopupMessage] = useState(false);
        const [createRecipeMessage, setCreateRecipeMessage] = useState('');
        const selectedStringCategory = useParams<{ Category: string }>().Category || "none";
        const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory == "none" ? "" : selectedStringCategory));
        const [selectedTags, setSelectedTags] = useState<string[]>([]);
        const [difficulty, setDifficulty] = useState(3);
        const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
        const [isCategoryEmpty, setIsCategoryEmpty] = useState<boolean>(false);
        const [isIngredientsEmpty, setIsIngredientsEmpty] = useState<boolean>(false);
        const [step, setStep] = useState<string>('');
        const [descriptionAsArray, setDescriptionAsArray] = useState<string[]>([]);
        const [isDescriptionEmpty, setIsDescriptionEmpty] = useState<boolean>(false);
        const [uploadedImage, setUploadedImage] = useState<File | null>(null);
        const [isDisabled, setIsDisabled] = useState<boolean>(false);

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

        const toggleSaveButton = (isDisabled: boolean): void => {
            setIsDisabled(isDisabled);
        };

        const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDifficulty(parseInt(event.target.value, 10));
        };

        const handleAddIngredient = () => {
            if (ingredient.trim() !== '') {
                setIngredientsList([...ingredientsList, ingredient]);
                setIngredient('');
            }
        };

        const handleRemoveIngredient = (index: number) => {
            const updatedIngredients = ingredientsList.filter((_, i) => i !== index);
            setIngredientsList(updatedIngredients);
        };

        const handleAddStep = () => {
            if (step.trim() !== '') {
                setDescription(description + step + "|");
                setStep('');
            }
        };

        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files && event.target.files[0];
            if (file && file.size > 5 * 1024 * 1024) {
                alert('Die Datei überschreitet die maximale Größe von 5 MB.');
                event.target.value = '';
                return;
            }
            setUploadedImage(file);
        };

        const handleRemoveImage = () => {
            setUploadedImage(null);
            setImageUrl('');
        };

        const toggleTag = (tag: string) => {
            if (selectedTags.includes(tag)) {
                setSelectedTags(selectedTags.filter(t => t !== tag));
            } else {
                setSelectedTags([...selectedTags, tag]);
            }
        };

        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            toggleSaveButton(true);
            setCreateRecipeMessage("Rezept wird gespeichert. Bitte warten...");

            let newImageUrl: string = imageUrl;

            if (uploadedImage != null) {
                const formData = new FormData();
                formData.append('file', uploadedImage);

                try {
                    const response = await fetch('https://' + hostData.host + ':30155/upload-image', {
                        method: "POST",
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        newImageUrl = data.gitUrl;
                    } else {
                        console.error('API 2 Error Status:', response.status);
                        alert('Fehler beim Hochladen des Bildes. Bitte versuche es erneut oder gib eine URL an.');
                        toggleSaveButton(false);
                        setCreateRecipeMessage("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                        return;
                    }
                } catch (error) {
                    console.error("Fehler bei der Weiterleitung:", error);
                    toggleSaveButton(false);
                    setCreateRecipeMessage("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                    return;
                }
            }

            if (title === "" || selectedCategory === "" || ingredientsList.length === 0 || isDescriptionEmpty || newImageUrl === "") {
                alert("Das Rezept konnte nicht gespeichert werden, da nicht alle Pflichtfelder (rot umrandet) ausgefüllt wurden!");
                toggleSaveButton(false);
                setCreateRecipeMessage("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
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
                image: newImageUrl,
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
                setCreateRecipeMessage("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                toggleSaveButton(false);
                return;
            }
        };

        const formatSteps = (stepsAsString: string) => {
            const stepsArray: string[] = [];
            let stepStartIndex = 0;

            for (let i = 0; i < stepsAsString.length; i++) {
                if (stepsAsString[i] === "|") {
                    const newStepToAdd: string = stepsAsString.substring(stepStartIndex, i);
                    stepsArray.push(newStepToAdd);
                    stepStartIndex = i + 1;
                }
            }
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

        useEffect(() => {
            formatSteps(description);
            description == "" ? setIsDescriptionEmpty(true) : setIsDescriptionEmpty(false);
        }, [description]);

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
                            <p className={"allergen-instructions-empty"}>Bitte klicke die dem Rezept entsprechenden
                                Allergen-Symbole an!</p>
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
                        <div className="image-upload-container">
                            {uploadedImage ? (
                                <div className="image-preview">
                                    <img
                                        className="hero__img"
                                        src={URL.createObjectURL(uploadedImage)}
                                        alt="Hochgeladenes Bild"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={handleRemoveImage}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ) : (
                                <div className="image-input-container">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="image-upload-input"
                                    />
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Lade ein Bild (bis 5 MB) hoch oder gib hier eine Bild-URL an..."
                                        className="image-url-input"
                                    />
                                </div>
                            )}
                        </div>
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
                        <p style={{marginBottom: "2%", marginTop: "2%"}} className={"allergen-instructions-empty"}>Bitte
                            wähle die Schwierigkeit des Rezeptes aus!</p>
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
                    <button type="submit" className="submit-recipe-button" disabled={isDisabled}>
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