import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

const dietaryTags = ["Vegan", "Vegetarisch", "Glutenfrei", "Nussfrei", "Eifrei"];

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number;
    Allergen: string;
    Ingredients: string;
    Steps: string;
    Vegan: number;
    Vegetarian: number;
}

interface ListItem {
    title: string;
    category: string;
    imageUrl: string;
    id: number
    allergen: string[];
    ingredients: string;
    steps: string;
    vegan: number;
    vegetarian: number;
}

interface showRecipeProps {
    isLoggedIn: boolean;
    username: string;
}

const extractString = (str: string, startMarker: string, endMarker: string): string => {
    const startIndex = str.indexOf(startMarker);
    if (startIndex === -1) return ""; // Falls Startmarkierung nicht gefunden wird

    const start = startIndex + startMarker.length;
    const endIndex = str.indexOf(endMarker, start);
    if (endIndex === -1) return ""; // Falls Endmarkierung nicht gefunden wird

    return str.substring(start, endIndex);
};


const ShowRecipe: React.FC<showRecipeProps> = ({isLoggedIn, username}) => {
    const [sampleRecipe, setSampleRecipe] = useState<ListItem | undefined>(undefined);
    const location = useLocation();
    const id = extractString(location.pathname, "recipe/", "/")
    const [ingredientsAsArray, setIngredientsAsArray] = useState<string[]>([]);
    const [stepssAsArray, setStepsAsArray] = useState<string[]>([]);
    const [activeStarOnHover, setActiveStarOnHover] = useState<number>(0);
    const [chosenStar, setChosenStar] = useState<number | null>(null);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [avRating, setAvRating] = useState<number>(0);

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`https://canoob.de:3007/getRecipeByID?id=${encodeURIComponent(id)}`, {
                method: 'GET'
            });
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

    async function getAvRating(): Promise<number | null> {
        try {
            const response = await fetch(`https://canoob.de:3007/getRatingByID?id=${encodeURIComponent(id)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();
                const onlyRating = recipes[0]["AVG(Bewertung)"];
                setAvRating(onlyRating);
                console.log(onlyRating)
                return onlyRating;
            } else {
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

    const formatIngredients = (ingredientsAsString: string) => {
        const ingredientsArray: string[] = []; // Temporäres Array zur Speicherung der Zutaten
        let ingredientStartIndex = 0;

        for (let i = 0; i < ingredientsAsString.length; i++) {
            if (ingredientsAsString[i] === "|") {
                const newIngredientToAdd: string = ingredientsAsString.substring(ingredientStartIndex, i).trim(); // Trimmen, um Leerzeichen zu entfernen
                ingredientsArray.push(newIngredientToAdd); // Füge die neue Zutat zum temporären Array hinzu
                ingredientStartIndex = i + 1;
            }
        }

        // Füge das letzte Element nach der Schleife hinzu
        const lastIngredient = ingredientsAsString.substring(ingredientStartIndex).trim();
        if (lastIngredient) {
            ingredientsArray.push(lastIngredient);
        }

        // Aktualisiere den Zustand mit dem neuen Array
        setIngredientsAsArray(ingredientsArray);
    };

    const formatSteps = (stepsAsString: string) => {
        const stepsArray: string[] = []; // Temporäres Array zur Speicherung der Zutaten
        let stepStartIndex = 0;

        for (let i = 0; i < stepsAsString.length; i++) {
            if (stepsAsString[i] === ".") {
                const newStepToAdd: string = stepsAsString.substring(stepStartIndex, i + 1).trim(); // Trimmen, um Leerzeichen zu entfernen
                stepsArray.push(newStepToAdd); // Füge die neue Zutat zum temporären Array hinzu
                stepStartIndex = i + 1;
            }
        }

        // Füge das letzte Element nach der Schleife hinzu
        const lastStep = stepsAsString.substring(stepStartIndex).trim();
        if (lastStep) {
            stepsArray.push(lastStep);
        }

        // Aktualisiere den Zustand mit dem neuen Array
        setStepsAsArray(stepsArray);
    };

    const handleShare = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        let ingredientsArray = ["Fehler", "Aufgetreten"]
        let steps = ""

        if ("ingredients" in sampleRecipe!) {
            ingredientsArray = sampleRecipe.ingredients.split("|");
        }

        if ("steps" in sampleRecipe!) {
            steps = sampleRecipe.steps.replace(/\r/g, '');
        }

        const requestData = {
            name: sampleRecipe?.title,
            image: sampleRecipe?.imageUrl,
            description: steps,
            ingredients: ingredientsArray,
        };

        //https://canoob.de:30157/generate-pdf
        //http://localhost:3000/generate-pdf
        const response = await fetch('https://canoob.de:30157/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Failed to generate PDF');
        }

        // Convert the response into a blob (binary data)
        const blob = await response.blob();

        // Create a download link for the blob and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recipe.pdf';  // Filename for the downloaded PDF
        document.body.appendChild(a);  // Append the link to the document
        a.click();  // Programmatically trigger a click event to download
        a.remove();  // Clean up the DOM by removing the link

        // Revoke the blob URL to free up memory
        window.URL.revokeObjectURL(url);
    }

    useEffect(() => {
        getAvRating()

        async function getRating(): Promise<number | null> {
            try {
                const response = await fetch(`https://canoob.de:3007/getRatingByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    const recipes = await response.json();
                    const onlyRating = recipes[0].Bewertung;
                    setChosenStar(onlyRating);
                    return 1;
                } else {
                    console.error('API request error:', response.status);
                    return null;
                }
            } catch (error) {
                console.error('Network error:', error);
                return null;
            }
        }

        getRating();
    }, [chosenStar]);

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipe = await getRecipes();
            if (recipe && Array.isArray(recipe)) {
                const newRecipe: ListItem = {
                    title: recipe[0].Title,
                    category: recipe[0].Category,
                    imageUrl: recipe[0].Image,
                    id: recipe[0].ID,
                    allergen: recipe[0].Allergen.split(", "),
                    ingredients: recipe[0].Ingredients,
                    steps: recipe[0].Steps,
                    vegan: recipe[0].Vegan,
                    vegetarian: recipe[0].Vegetarian
                };
                formatIngredients(newRecipe.ingredients);
                formatSteps(newRecipe.steps);
                setSampleRecipe(newRecipe);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };


        fetchRecipe();

    }, []);

    useEffect(() => {
        async function saveRating(): Promise<number | null> {
            try {
                const response = await fetch(`https://canoob.de:3007/saveRating?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&rating=${encodeURIComponent(chosenStar!)}`, {
                    method: 'POST'
                });
                if (response.ok) {
                    return 1;
                } else {
                    console.error('API request error:', response.status);
                    return null;
                }
            } catch (error) {
                console.error('Network error:', error);
                return null;
            }
        }

        saveRating();
    }, [chosenStar]);

    console.log(sampleRecipe?.allergen)

    return (
        <body className="showRecipe">
        <header className="showRecipe-hero">
            <div className="showRecipe-contentfield">
                <div className="showRecipe-contentfield-left">
                    <h1 className="showRecipe-title">{sampleRecipe?.title}</h1>
                    <p className="showRecipe-category">{sampleRecipe?.category}</p>
                    {avRating != 0 && <div className="rating-system-header">
                        <img className="first-star"
                             alt={avRating >= 1 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={avRating >= 1 ? "/images/filledLightStar.png" : avRating === 0 ? "/images/emptyStar.png" : avRating > 0 ? "/images/halfStar.png" : "/images/emptyStar.png"}/>
                        <img className="second-star"
                             alt={(avRating >= 2) ? "ausgefüllter Stern" : "leerer Stern"}
                             src={avRating >= 2 ? "/images/filledLightStar.png" : avRating == 1 ? "/images/emptyStar.png" : avRating > 1 ? "/images/halfStar.png" : "/images/emptyStar.png"}/>
                        <img className="third-star"
                             alt={avRating >= 3 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={avRating >= 3 ? "/images/filledLightStar.png" : avRating == 2 ? "/images/emptyStar.png" : avRating > 2 ? "/images/halfStar.png" : "/images/emptyStar.png"}/>
                        <img className="fourth-star"
                             alt={avRating >= 4 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={avRating >= 4 ? "/images/filledLightStar.png" : avRating == 3 ? "/images/emptyStar.png" : avRating > 3 ? "/images/halfStar.png" : "/images/emptyStar.png"}/>
                        <img className="fifth-star"
                             alt={avRating >= 5 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={avRating >= 5 ? "/images/filledLightStar.png" : avRating == 4 ? "/images/emptyStar.png" : avRating > 4 ? "/images/halfStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(5)} onMouseLeave={() => setActiveStarOnHover(0)}/>
                    </div>}

                    {avRating == 0 && <div className="rating-null">
                        Für dieses Rezept gibt es noch keine Bewertung!
                    </div>}
                </div>
                <div className="showRecipe-contentfield-right">
                    <div className="showRecipe-properties">
                        {sampleRecipe?.vegetarian==1 &&
                        <img className={"allergen-symbol"}
                             src='/images/vegetarian.png'
                             alt="vegetarisch-Symbol"/>}
                        {sampleRecipe?.vegan == 1 &&
                        <img className={"allergen-symbol"}
                             src='/images/vegan.png'
                             alt="vegan-symbol"/>}
                        {sampleRecipe?.allergen && dietaryTags.map((item) => (
                            sampleRecipe?.allergen.includes(item) &&
                            <img className={"allergen-symbol"}
                                 src={`/images/${item.toLowerCase()}.png`}
                                 alt={`${item.toLowerCase()}-symbol`}/>))}
                    </div>
                </div>
            </div>
        </header>
        <div className="showRecipe-main">
            <div className="showRecipe-main-head">
                <img className="hero__img" src={sampleRecipe?.imageUrl} alt={sampleRecipe?.title}/>
                <div className="showRecipe-properties-ingredients">
                    <h1 className="showRecipe-properties-ingredients-title"> Zutaten: </h1>
                    <div
                        className="showRecipe-properties-ingredients-map">{ingredientsAsArray.map((element, index) => (
                        <p key={index} className="recipes-ingredient" style={{fontSize: "120%"}}>{element}</p>
                    ))}</div>
                </div>
            </div>
            <div className="separator-line"></div>
            <div className="showRecipe-properties-steps">
                <h1 className="showRecipe-properties-step-title"> Zubereitung: </h1>
                <div className="showRecipe-properties-step">{stepssAsArray.map((element, index) => (
                    <p key={index} className="recipes-step" style={{fontSize: "120%"}}>{element}</p>
                ))}</div>
            </div>
            <div className="separator-line"></div>
            <div className="actions-field">
                <div className="star-system">
                    {isLoggedIn && <div className="rating-system">
                        <img className="first-star"
                             alt={activeStarOnHover >= 1 || chosenStar! >= 1 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={activeStarOnHover >= 1 || chosenStar! >= 1 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(1)} onMouseLeave={() => setActiveStarOnHover(0)}
                             onClick={() => setChosenStar(1)}/>
                        <img className="second-star"
                             alt={activeStarOnHover >= 2 || chosenStar! >= 2 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={activeStarOnHover >= 2 || chosenStar! >= 2 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(2)} onMouseLeave={() => setActiveStarOnHover(0)}
                             onClick={() => setChosenStar(2)}/>
                        <img className="third-star"
                             alt={activeStarOnHover >= 3 || chosenStar! >= 3 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={activeStarOnHover >= 3 || chosenStar! >= 3 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(3)} onMouseLeave={() => setActiveStarOnHover(0)}
                             onClick={() => setChosenStar(3)}/>
                        <img className="fourth-star"
                             alt={activeStarOnHover >= 4 || chosenStar! >= 4 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={activeStarOnHover >= 4 || chosenStar! >= 4 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(4)} onMouseLeave={() => setActiveStarOnHover(0)}
                             onClick={() => setChosenStar(4)}/>
                        <img className="fifth-star"
                             alt={activeStarOnHover >= 5 || chosenStar! >= 5 ? "ausgefüllter Stern" : "leerer Stern"}
                             src={activeStarOnHover >= 5 || chosenStar! >= 5 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                             onMouseOver={() => setActiveStarOnHover(5)} onMouseLeave={() => setActiveStarOnHover(0)}
                             onClick={() => setChosenStar(5)}/>
                    </div>}
                    {!isLoggedIn && <div className="fake-rating-system" onMouseOver={() => setShowMessage(true)}
                                         onMouseLeave={() => setShowMessage(false)}>
                        <img className="first-star"
                             alt="disableStar"
                             src="/images/emptyStar.png"/>
                        <img className="first-star"
                             alt="disableStar"
                             src="/images/emptyStar.png"/>
                        <img className="first-star"
                             alt="disableStar"
                             src="/images/emptyStar.png"/>
                        <img className="first-star"
                             alt="disableStar"
                             src="/images/emptyStar.png"/>
                        <img className="first-star"
                             alt="disableStar"
                             src="/images/emptyStar.png"/>
                    </div>}
                    {showMessage && <div className="message">
                        Du musst dich anmelden, um das Rezept zu bewerten!
                    </div>}
                </div>
                <button type="submit" className="download-button" onSubmit={() => handleShare}>Teilen</button>
            </div>
        </div>
        </body>
    );
};

export default ShowRecipe;