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
    const allergens = ["Glutenfrei", "Lactosefrei", "Eifrei", "Nussfrei"];

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
    const [isCategoryEmpty, setIsCategoryEmpty] = useState<boolean>(false);
    const [isIngredientsEmpty, setIsIngredientsEmpty] = useState<boolean>(false);
    const [step, setStep] = useState<string>('');
    const [descriptionAsArray, setDescriptionAsArray] = useState<string[]>([]);
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [hasImageLink, setHasImageLink] = useState(false)

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
        setHasImageLink(false);
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
        const elements = document.querySelectorAll('[data-notwendigEinzhinzu]');
        for (const temp of elements) {
            const e = temp as HTMLInputElement;
            if (e.className.startsWith('ingredient')) {
                if (!isIngredientsEmpty) {
                    e.setCustomValidity('Es muss mindestens eine Zutat hinzugefügt werden!');
                    e.reportValidity();
                    e.className = "ingredient-input-empty";
                }
            } else {
                if (isDescriptionEmpty) {
                    e.setCustomValidity('Es muss mindestens ein Zubereitungsschritt hinzugefügt werden!');
                    e.reportValidity();
                    e.className = "step-input-field-empty";
                }
            }

        }
        if (!isIngredientsEmpty && isDescriptionEmpty) {
            return;
        }
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
        selectedCategory == "" ? setIsCategoryEmpty(true) : setIsCategoryEmpty(false);
    }, [selectedCategory]);

    useEffect(() => {
        ingredientsList.length > 0 ? setIsIngredientsEmpty(true) : setIsIngredientsEmpty(false);
    }, [ingredientsList]);

    useEffect(() => {
        formatSteps(description);
        description == "" ? setIsDescriptionEmpty(true) : setIsDescriptionEmpty(false);
    }, [description]);

    const handleInputUberprufung = (e: React.ChangeEvent<HTMLInputElement>, darfleersein: boolean, nichtakzeptierRot: string, aktzeptiertWeis: string) => {
        console.log(e, darfleersein, nichtakzeptierRot, e.target.value);
        const value = e.target.value;
        const pattern = new RegExp(/^([A-Za-z0-9ÄÖÜäöüß]{0,25})([-\s]+[A-Za-z0-9ÄÖÜäöüß]{1,25})*$/);

        if (value === "" && !darfleersein) {
            if (nichtakzeptierRot.startsWith("input")) {
                e.target.setCustomValidity('Der Titel darf nicht lehr sein!');
            } else if (nichtakzeptierRot.startsWith("ingredient")) {
                e.target.setCustomValidity('Es muss mindestens eine Zutat hinzugefügt werden!');
            } else if (nichtakzeptierRot.startsWith("step")) {
                e.target.setCustomValidity('Es muss mindestens ein Zubereitungsschritt hinzugefügt werden!');
            }

            e.target.reportValidity();
            e.target.className = nichtakzeptierRot;
            return;
        }
        if (pattern.test(value)) {
            e.target.setCustomValidity('');
            e.target.className = aktzeptiertWeis;
        } else {
            e.target.setCustomValidity('Jedes Wort darf maximal 25 zeichen lang sein, danach muss ein Leerzeichen oder - folgen.');
            e.target.reportValidity();
            e.target.className = nichtakzeptierRot;
        }
    };

    const checkImageURL = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };
    useEffect(() => {
        if (imageUrl.trim() === "") {
            setIsValid(null);
            return;
        }

        checkImageURL(imageUrl).then((isValid) => {
            setIsValid(isValid);
            if (isValid==true){
                setHasImageLink(true);
            }
        });
    }, [imageUrl]);

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
                                className="input-field-reqired-empty"
                                onChange={(e) => {
                                    handleInputUberprufung(e, false, "input-field-reqired-empty", "input-field-reqired-filled");
                                    setTitle(e.target.value)
                                }}
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
                            {allergens.map((item) => (
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
                        {uploadedImage || hasImageLink ? (
                            <div className="image-preview">
                                <img
                                    className="hero__preimg"
                                    src={ uploadedImage ? URL.createObjectURL(uploadedImage) : imageUrl}
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
                            <div className="image-input-container d-flex flex-column align-items-center">
                                <div className="image-upload-wrapper position-relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="imageUpload"
                                        onChange={handleImageUpload}
                                        className="image-upload-input"
                                    />
                                    <label style={{width: "100%"}} className="image-upload-label">
                                        <img
                                            src="/images/fileUpload.png"
                                            alt="File Upload"
                                            className="img-fluid placeholder-image"
                                        />
                                    </label>
                                </div>
                                <div className="mt-3 w-100">
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Lade ein Bild hoch oder gib eine Bild-URL ein..."
                                        className={isValid ? "form-control-valid" : "form-control-red"}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="showRecipe-properties-ingredients">
                        <h1 className="showRecipe-properties-ingredients-title"> Zutaten: </h1>
                        <div className="showRecipe-properties-ingredients-map">
                            <input
                                type="text"
                                className={"ingredient-input-empty"}
                                data-notwendigEinzhinzu="ingredient"
                                value={ingredient}
                                onChange={(e) => {
                                    handleInputUberprufung(e, isIngredientsEmpty, "ingredient-input-empty", "ingredient-input-filled");
                                    setIngredient(e.target.value)
                                }}
                                placeholder="Gib eine Zutat ein und füge Sie sie mit '+' hinzu..."
                                required={!isIngredientsEmpty}
                            />
                            <button
                                type="button"
                                className="add-ingredient-button"

                                onClick={() => {
                                    handleInputUberprufung({target: (document.querySelectorAll('[data-notwendigEinzhinzu="ingredient"]').item(0))} as React.ChangeEvent<HTMLInputElement>, isIngredientsEmpty, "ingredient-input-empty", "ingredient-input-filled");
                                    if (new RegExp(/^([A-Za-z0-9ÄÖÜäöüß]{1,25})([-\s]+[A-Za-z0-9ÄÖÜäöüß]{1,25})*$/).test(ingredient)) {
                                        handleAddIngredient()
                                    }
                                }
                                }
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
                            className={"step-input-field-empty"}
                            data-notwendigEinzhinzu="step"
                            onChange={(e) => {
                                handleInputUberprufung(e, !isDescriptionEmpty, "step-input-field-empty", "step-input-field-filled");
                                setStep(e.target.value)
                            }}
                            placeholder={isDescriptionEmpty ? "Gib den ersten Schritt des Rezepts ein und füge ihn mit '+' hinzu..." : "Gib den nächsten Schritt des Rezepts ein und füge ihn mit '+' hinzu..."}
                            required={isDescriptionEmpty}
                        ></input>
                        <button
                            type="button"
                            className="add-ingredient-button"
                            onClick={() => {
                                handleInputUberprufung({target: document.querySelectorAll('[data-notwendigEinzhinzu="step"]').item(0)} as React.ChangeEvent<HTMLInputElement>, !isDescriptionEmpty, "step-input-field-empty", "step-input-field-filled");
                                if (new RegExp(/^([A-Za-z0-9ÄÖÜäöüß]{1,25})([-\s]+[A-Za-z0-9ÄÖÜäöüß]{1,25})*$/).test(step)) {
                                    handleAddStep()
                                }
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="difficulty-slider-container">
                    <p style={{marginBottom: "2%", marginTop: "2%", color: "black"}}
                       className={"allergen-instructions-empty"}>Bitte
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
    );
};

export default CreateRecipe;