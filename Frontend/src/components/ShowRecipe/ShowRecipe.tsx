import "./ShowRecipe.css";
import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import bookmarkFilledIcon from '/images/fullBookmark.png';
import bookmarkEmptyIcon from '/images/lightBookmark.png';
import ErrorPage from "../errorPage.tsx";
import configData from '../../../../config/frontend-config.json';
import ShowUser from "../ShowUser/showUser.tsx";

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

const hostData: Config = configData;

const dietaryTags = ["Vegan", "Vegetarisch", "Glutenfrei", "Nussfrei", "Eifrei", "Lactosefrei"];

const extractString = (str: string, startMarker: string, endMarker: string): string => {
    const startIndex = str.indexOf(startMarker);
    if (startIndex === -1) return "";

    const start = startIndex + startMarker.length;
    const endIndex = str.indexOf(endMarker, start);
    if (endIndex === -1) return "";

    return str.substring(start, endIndex);
};

const ShowRecipe: React.FC<showRecipeProps> = ({isLoggedIn, username}) => {
    const [sampleRecipe, setSampleRecipe] = useState<ListItem | undefined>(undefined);
    const location = useLocation();
    const id = extractString(location.pathname, "recipe/", "/")
    const [ingredientsAsArray, setIngredientsAsArray] = useState<string[]>([]);
    const [stepsAsArray, setStepsAsArray] = useState<string[]>([]);
    const [activeStarOnHover, setActiveStarOnHover] = useState<number>(0);
    const [chosenStar, setChosenStar] = useState<number>(0);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [avRating, setAvRating] = useState<number>(0);
    const isValidCreator = (creator: string | undefined) => {
        const invalidCreators = ["1", "12345"];
        return creator && !invalidCreators.includes(creator);
    };
    const validCreator = sampleRecipe?.creator && isValidCreator(sampleRecipe.creator) ? sampleRecipe.creator : "GourmetGuide Team";
    const [showPopup, setShowPopup] = useState(false);
    const [showErrorPage, setShowErrorPage] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showUser, setShowUser] = useState<boolean>(false);

    const getBookmark = async () => {
        try {
            const respone = await fetch(`https://` + hostData.host + `:30155/getBookmarkByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}`, {
                method: 'GET'

            });
            const isBookmarked = await respone.json();
            return isBookmarked[0].Bookmark === 1
        } catch (error) {
            console.error('Error getting bookmark status:', error);
            return false
        }
    }

    useEffect(() => {

        const checkBookmark = async () => {
            try {
                const isBookmarked = await getBookmark();
                setIsBookmarked(isBookmarked);
            } catch (error) {
                console.error("Error checking bookmark status:", error);
            }
        };

        checkBookmark();
    }, []);

    const toggleBookmark = async () => {
        if (!isLoggedIn) {
            return;
        }

        try {
            const newBookmarkState = !isBookmarked;
            setIsBookmarked(newBookmarkState);

            const response = await fetch(`https://` + hostData.host + `:30155/saveBookmark?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&bookmark=${encodeURIComponent(newBookmarkState ? 1 : 0)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to update bookmark');
            }
        } catch (error) {
            console.error('Error saving bookmark:', error);
            setIsBookmarked(!isBookmarked);
        }
    };

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch(`https://` + hostData.host + `:30155/getRecipeByID?id=${encodeURIComponent(id)}`, {
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
            const response = await fetch(`https://` + hostData.host + `:30155/getRatingByID?id=${encodeURIComponent(id)}`, {
                method: 'GET'
            });
            if (response.ok) {
                const recipes = await response.json();
                const onlyRating = recipes[0]["AVG(Bewertung)"];
                setAvRating(onlyRating);
                return onlyRating;
            } else {
                console.error('API request error:', response.status);
                console.error('API request error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Network error:', error);
            return null;
        }
    }

    const formatIngredients = (ingredientsAsString: string) => {
        const ingredientsArray: string[] = [];
        let ingredientStartIndex = 0;

        for (let i = 0; i < ingredientsAsString.length; i++) {
            if (ingredientsAsString[i] === "|") {
                const newIngredientToAdd: string = ingredientsAsString.substring(ingredientStartIndex, i).trim();
                ingredientsArray.push(newIngredientToAdd);
                ingredientStartIndex = i + 1;
            }
        }

        const lastIngredient = ingredientsAsString.substring(ingredientStartIndex).trim();

        if (lastIngredient) {
            ingredientsArray.push(lastIngredient);
        }

        setIngredientsAsArray(ingredientsArray);
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

        setStepsAsArray(stepsArray);
    };

    const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        let ingredientsArray = ["Fehler", "Aufgetreten"];
        let steps = "";

        if ("ingredients" in sampleRecipe!) {
            ingredientsArray = sampleRecipe.ingredients.split("|");
        }

        if ("steps" in sampleRecipe!) {
            steps = sampleRecipe.steps.replace(/\r/g, '');
        }

        const allergenForShare = sampleRecipe?.allergen?.slice();

        if(sampleRecipe?.vegan && !allergenForShare?.includes("Vegan")){
            allergenForShare?.push("Vegan")
        }

        if (sampleRecipe?.vegetarian && !allergenForShare?.includes("Vegetarisch")){
            allergenForShare?.push("Vegetarisch")
        }

        const requestData = {
            name: sampleRecipe?.title,
            image: sampleRecipe?.imageUrl,
            category: sampleRecipe?.category,
            allergen: allergenForShare,
            description: steps,
            ingredients: ingredientsArray,
            creator: validCreator,
            id: sampleRecipe?.id,
        };

        const response = await fetch('https://' + hostData.host + ':30155/generate-pdf', {
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
        a.download = `${requestData.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    };

    async function getRating(): Promise<number | null> {
        try {
            const response = await fetch(`https://` + hostData.host + `:30155/getRatingByIDAndUser?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}`, {
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

    useEffect(() => {
        getAvRating()
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

    async function saveRating(ratingNumber: number): Promise<number | null> {
        try {
            const response = await fetch(`https://` + hostData.host + `:30155/saveRating?id=${encodeURIComponent(id)}&user=${encodeURIComponent(username)}&rating=${encodeURIComponent(ratingNumber)}`, {
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

    useEffect(() => {
        if (showPopup) {
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    }, [showPopup]);

    useEffect(() => {
        if (sampleRecipe == undefined) {
            setShowErrorPage(1);
        } else {
            setShowErrorPage(0)
        }
    }, [sampleRecipe]);

    return (
        <body className="showRecipe">
        {showErrorPage == 0 && <>
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
                                 onMouseOver={() => setActiveStarOnHover(5)}
                                 onMouseLeave={() => setActiveStarOnHover(0)}/>
                        </div>}
                    </div>
                    <div className="showRecipe-contentfield-right">
                        <div className="showRecipe-properties">
                            {sampleRecipe?.vegetarian == 1 &&
                                <img className={"allergen-symbol"}
                                     src='/images/vegetarian.png'
                                     alt="vegetarisch-Symbol"
                                     title={"Vegetarisch"}/>}
                            {sampleRecipe?.vegan == 1 &&
                                <img className={"allergen-symbol"}
                                     src='/images/vegan.png'
                                     alt="vegan-symbol"
                                     title={"Vegan"}/>}
                            {sampleRecipe?.allergen && dietaryTags.map((item) => (
                                sampleRecipe?.allergen != null && sampleRecipe.allergen.includes(item) &&
                                <img className={"allergen-symbol"}
                                     src={`/images/${item.toLowerCase()}.png`}
                                     alt={`${item.toLowerCase()}-symbol`}
                                     title={item}/>))}
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
                    <div className="showRecipe-properties-step">{stepsAsArray.map((element, index) => (
                        <p key={index} className="recipes-step" style={{fontSize: "120%"}}>{element}</p>
                    ))}</div>
                </div>
                <div className="separator-line"></div>
                <p>Ersteller: {validCreator}
                <button className="btn m-2 text-white" style={{background: "#07546e"}} onClick={() => setShowUser(!showUser)}> View User</button>
                </p>
                <div className="actions-field">
                    <div className="bookmark">
                        {isLoggedIn &&
                            <img
                                src={isBookmarked ? bookmarkFilledIcon : bookmarkEmptyIcon}
                                alt={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                onClick={toggleBookmark}
                                className="bookmark-button"/>}
                    </div>
                    <div className="star-system" onMouseOver={() => !isLoggedIn && setShowMessage(true)}
                         onMouseLeave={() => setShowMessage(false)}>
                        {isLoggedIn && <div className="rating-system-out">
                            <p className={'rating-text'}>Deine Bewertung:</p>
                            <div className="rating-system">
                                <img className="first-star"
                                     alt={activeStarOnHover >= 1 || chosenStar! >= 1 ? "ausgefüllter Stern" : "leerer Stern"}
                                     src={activeStarOnHover >= 1 || chosenStar! >= 1 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                                     onMouseOver={() => setActiveStarOnHover(1)}
                                     onMouseLeave={() => setActiveStarOnHover(0)}
                                     onClick={() => {
                                         setChosenStar(1);
                                         saveRating(1);
                                         setShowPopup(true);
                                     }}/>
                                <img className="second-star"
                                     alt={activeStarOnHover >= 2 || chosenStar! >= 2 ? "ausgefüllter Stern" : "leerer Stern"}
                                     src={activeStarOnHover >= 2 || chosenStar! >= 2 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                                     onMouseOver={() => setActiveStarOnHover(2)}
                                     onMouseLeave={() => setActiveStarOnHover(0)}
                                     onClick={() => {
                                         setChosenStar(2);
                                         saveRating(2);
                                         setShowPopup(true);
                                     }}/>
                                <img className="third-star"
                                     alt={activeStarOnHover >= 3 || chosenStar! >= 3 ? "ausgefüllter Stern" : "leerer Stern"}
                                     src={activeStarOnHover >= 3 || chosenStar! >= 3 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                                     onMouseOver={() => setActiveStarOnHover(3)}
                                     onMouseLeave={() => setActiveStarOnHover(0)}
                                     onClick={() => {
                                         setChosenStar(3);
                                         saveRating(3);
                                         setShowPopup(true);
                                     }}/>
                                <img className="fourth-star"
                                     alt={activeStarOnHover >= 4 || chosenStar! >= 4 ? "ausgefüllter Stern" : "leerer Stern"}
                                     src={activeStarOnHover >= 4 || chosenStar! >= 4 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                                     onMouseOver={() => setActiveStarOnHover(4)}
                                     onMouseLeave={() => setActiveStarOnHover(0)}
                                     onClick={() => {
                                         setChosenStar(4);
                                         saveRating(4);
                                         setShowPopup(true);
                                     }}/>
                                <img className="fifth-star"
                                     alt={activeStarOnHover >= 5 || chosenStar! >= 5 ? "ausgefüllter Stern" : "leerer Stern"}
                                     src={activeStarOnHover >= 5 || chosenStar! >= 5 ? "/images/fullStar.png" : "/images/emptyStar.png"}
                                     onMouseOver={() => setActiveStarOnHover(5)}
                                     onMouseLeave={() => setActiveStarOnHover(0)}
                                     onClick={() => {
                                         setChosenStar(5);
                                         saveRating(5);
                                         setShowPopup(true);
                                     }}/>
                            </div>
                        </div>}
                        {!isLoggedIn && <div className="fake-rating-system">
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
                        {showPopup && <p className={'save-rating-confirm'}>Bewertung wurde gespeichert!</p>}
                    </div>
                    <button type="button" onClick={handleShare} className="download-button">Als PDF speichern
                    </button>
                </div>
            </div>
        </>}
        {showErrorPage == 1 && <ErrorPage/>}

        {showUser && <ShowUser isLoggedIn={isLoggedIn} usernameLoggedIn={username} usernameToShow={validCreator} closeModal={() => setShowUser(false)}/>}
        </body>
    );
};

export default ShowRecipe;