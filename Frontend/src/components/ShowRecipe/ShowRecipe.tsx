import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

const dietaryTags = ["Vegan", "Vegetarisch", "Glutenfrei", "Nussfrei", "Eifrei", "Lactosefrei"];

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number;
    Allergen: string | null;
    Ingredients: string;
    Steps: string;
    Vegan: number;
    Vegetarian: number;
    Creator: string;
}

interface ListItem {
    title: string;
    category: string;
    imageUrl: string;
    id: number
    allergen: string[] | null;
    ingredients: string;
    steps: string;
    vegan: number;
    vegetarian: number;
    creator: string;
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
    const [chosenStarOld, setChosenStarOld] = useState<number>(-1);
    const [chosenStar, setChosenStar] = useState<number>(-1);
    const [activeStarOnHover, setActiveStarOnHover] = useState<number>(0);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [avRating, setAvRating] = useState<number>(0);

    const isValidCreator = (creator: string | undefined) => {
        const invalidCreators = ["1", "12345"]; // Add more invalid values here as needed
        return creator && !invalidCreators.includes(creator);
    };
    const validCreator = sampleRecipe?.creator && isValidCreator(sampleRecipe.creator) ? sampleRecipe.creator : "GourmetGuide Team";

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
    useEffect(() => {
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
        getAvRating()
    }, [avRating]);



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

    const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent default button behavior

        let ingredientsArray = ["Fehler", "Aufgetreten"];
        let steps = "";

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
            creator: validCreator,
            id: sampleRecipe?.id,
        };

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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recipe.pdf';  // Filename for the downloaded PDF
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    };


    async function getRating(): Promise<number | null> {
        try {
            const response = await fetch(`https://canoob.de:3007/getRatingByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();
                const onlyRating = recipes[0].Bewertung;
                setChosenStarOld(onlyRating-1);
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
    useEffect(() => {
        if (chosenStarOld !== -1) {
            setChosenStar(chosenStarOld);
        }
    }, [chosenStarOld]);

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipe = await getRecipes();
            if (recipe && Array.isArray(recipe)) {
                const newRecipe: ListItem = {
                    title: recipe[0].Title,
                    category: recipe[0].Category,
                    imageUrl: recipe[0].Image,
                    id: recipe[0].ID,
                    allergen: recipe[0].Allergen != null ? recipe[0].Allergen.split(", ") : null,
                    ingredients: recipe[0].Ingredients,
                    steps: recipe[0].Steps,
                    vegan: recipe[0].Vegan,
                    vegetarian: recipe[0].Vegetarian,
                    creator: recipe[0].Creator,
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


    const saveRating = async (rating: number) => {
        setChosenStarOld(rating-1);
        console.log(rating)
        try {
            const response = await fetch(`https://canoob.de:3007/saveRating?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&rating=${encodeURIComponent(rating)}`, {
                method: 'POST',
            });
            if (response.ok) {
                console.log('Rating saved successfully!');
            } else {
                console.error('API request error:', response.status);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <body className="showRecipe">
        <header className="showRecipe-hero">
            <div className="showRecipe-contentfield">
                <div className="showRecipe-contentfield-left">
                    <h1 className="showRecipe-title">{sampleRecipe?.title}</h1>
                    <p className="showRecipe-category">{sampleRecipe?.category}</p>
                        {avRating != 0 ? (
                            <div className="rating-system-header">
                                {
                                    Array.from({ length: 5 }, (_, index) => {

                                    const isFilled = avRating >= index + 1;

                                    return (
                                        <svg
                                            key={index}
                                            width="30"
                                            height="30"
                                            viewBox="-4 -4 76 72"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g transform="matrix(1,0,0,1,-387.353,-244.771)">
                                                <g transform="matrix(0.672991,0,0,-0.672991,57.9243,517.669)">
                                                    <path
                                                        className={`star-icon ${isFilled ? 'empty' : 'filled'}`}
                                                        d="M490,370.17L528.32,370.17L540,405L551.68,370.17L590,370.17L559.47,346.84L571.58,310L540,332.8L508.42,310L520.53,346.84L490,370.17Z"
                                                    />
                                                    <path
                                                        className="Star__Outline"
                                                        d="M490,374.454L525.238,374.454L535.938,406.362C536.524,408.108 538.159,409.284 540,409.284C541.841,409.284 543.476,408.108 544.062,406.362L554.762,374.454L590,374.454C591.837,374.454 593.469,373.283 594.058,371.543C594.647,369.803 594.061,367.881 592.601,366.766L564.491,345.285L575.65,311.338C576.23,309.574 575.608,307.638 574.109,306.542C572.611,305.446 570.577,305.44 569.072,306.527L540,327.516L510.928,306.527C509.423,305.44 507.389,305.446 505.891,306.542C504.392,307.638 503.77,309.574 504.35,311.338L515.509,345.285L487.399,366.766C485.939,367.881 485.353,369.803 485.942,371.543C486.531,373.283 488.163,374.454 490,374.454ZM490,370.17L520.53,346.84L508.42,310L540,332.8L571.58,310L559.47,346.84L590,370.17L551.68,370.17L540,405L528.32,370.17L490,370.17Z"
                                                    />
                                                </g>
                                            </g>
                                        </svg>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rating-null">Für dieses Rezept gibt es noch keine Bewertung!</div>
                        )}
                </div>
                <div className="showRecipe-contentfield-right">
                    <div className="showRecipe-properties">
                        {sampleRecipe?.vegetarian == 1 &&
                            <img className={"allergen-symbol"}
                                 src='/images/vegetarian.png'
                                 alt="vegetarisch-Symbol"/>}
                        {sampleRecipe?.vegan == 1 &&
                            <img className={"allergen-symbol"}
                                 src='/images/vegan.png'
                                 alt="vegan-symbol"/>}
                        {sampleRecipe?.allergen && dietaryTags.map((item) => (
                            sampleRecipe?.allergen != null && sampleRecipe.allergen.includes(item) &&
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
            <p>Ersteller: {validCreator}</p>
            <div className="actions-field">
                <div className="star-system">


                        <div className="rating-system" onMouseLeave={() => setChosenStar(chosenStarOld)}>

                            {Array.from({length: 5}, (_, index) => {

                                const isNotFilled = index > (chosenStar! == null ? -1 : chosenStar); // Prüft, ob der aktuelle Stern gefüllt sein sollte
                                return (
                                    <svg
                                        key={index}
                                        width="30"
                                        height="30"
                                        viewBox="-4 -4 76 72"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={isLoggedIn ? () => saveRating(chosenStar+1) : () => ""}
                                        onMouseEnter={() => setChosenStar(index)}
                                    >
                                        <g transform="matrix(1,0,0,1,-387.353,-244.771)">
                                            <g transform="matrix(0.672991,0,0,-0.672991,57.9243,517.669)">
                                                <path
                                                    className={`star-icon ${!isNotFilled ? 'rempty' : 'rfilled'}`} // Dynamische Klasse für den Füllzustand
                                                    d="M490,370.17L528.32,370.17L540,405L551.68,370.17L590,370.17L559.47,346.84L571.58,310L540,332.8L508.42,310L520.53,346.84L490,370.17Z"
                                                />
                                                <path
                                                    className="Star__Outline"
                                                    d="M490,374.454L525.238,374.454L535.938,406.362C536.524,408.108 538.159,409.284 540,409.284C541.841,409.284 543.476,408.108 544.062,406.362L554.762,374.454L590,374.454C591.837,374.454 593.469,373.283 594.058,371.543C594.647,369.803 594.061,367.881 592.601,366.766L564.491,345.285L575.65,311.338C576.23,309.574 575.608,307.638 574.109,306.542C572.611,305.446 570.577,305.44 569.072,306.527L540,327.516L510.928,306.527C509.423,305.44 507.389,305.446 505.891,306.542C504.392,307.638 503.77,309.574 504.35,311.338L515.509,345.285L487.399,366.766C485.939,367.881 485.353,369.803 485.942,371.543C486.531,373.283 488.163,374.454 490,374.454ZM490,370.17L520.53,346.84L508.42,310L540,332.8L571.58,310L559.47,346.84L590,370.17L551.68,370.17L540,405L528.32,370.17L490,370.17Z"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                );
                            })}
                        </div>
                    {!isLoggedIn &&
                        <div className="message">
                        Du musst dich anmelden, um das Rezept zu bewerten!
                        </div>
                    }
                </div>
                <button type="button" onClick={handleShare} className="download-button">Teilen</button>
            </div>
        </div>
        </body>
    );
};

export default ShowRecipe;