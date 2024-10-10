import React, {useEffect, useState} from "react";
import './MainSearch.css';
import {useParams} from "react-router-dom";
import SearchRecipeView from "./SearchRecipeView.tsx";


const MainSearch: React.FC = () => {
    const receptStringName = useParams<{ receptName: string }>().receptName||"none";
    const [receptName, setReceptName] = useState<string>((receptStringName =="none"?"":receptStringName));
    const selectedStringRating = useParams<{ Rating: string }>().Rating||"none";
    const [selectedRating, setSelectedRating] = useState<string>((selectedStringRating =="none"?"":selectedStringRating));
    const selectedStringCategory = useParams<{ Category: string }>().Category||"none";
    const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory =="none"?"":selectedStringCategory));
    const selectedStringDifficulty = useParams<{ Difficulty: string }>().Difficulty||"none";
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>((selectedStringDifficulty =="none"?"":selectedStringDifficulty));


    const [selectedIngr, setSelectedIngr] = useState('');
    const selectedStringIngredients = useParams<{ zutaten: string }>().zutaten||"none";
    const selectedStringArrayIngredients = selectedStringIngredients=="none"?[]:selectedStringIngredients.split(",");
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>(selectedStringArrayIngredients);

    const addVeg = () => {
        if (!selectedIngredients.includes(selectedIngr)) {
            setSelectedIngredients(prevVegs => [...prevVegs, selectedIngr]);
        }
    };

    const removeVeg = (veg: string) => {
        setSelectedIngredients(prevVegs => prevVegs.filter(v => v !== veg));
    };

    interface Recipe {
        ingredient: string;
    }
    interface Category{
        Category: string;
    }

    async function getAllIngredients(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('https://canoob.de:3007/getAllIngredients');
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
    const [ingredients, setIngredients] = useState<string[]>([]);
    useEffect(() => {
        const fetchRecipes = async () => {
            const allIngredientsJson = await getAllIngredients();
            allIngredientsJson?.forEach((item) => {
                setIngredients((prevIngredients) => [...prevIngredients, item as unknown as string]);
            })
            setSelectedIngr(allIngredientsJson![0] as unknown as string);
        };

        fetchRecipes();
    }, []);



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

    const handleonSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceptName(event.target.value);
    };

    function getLink() {
        console.log(selectedIngredients);
        const tempURL = "/mainsearch/"+ (receptName==""?"none":receptName)+"/"+(selectedCategory==""?"none":selectedCategory)+"/"+(selectedDifficulty==""?"none":selectedDifficulty)+"/"+(selectedIngredients.toString()==""?"none":selectedIngredients.join(",").toString())+"/";
        console.log(tempURL)
        return tempURL;
    }
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div>
            <main className="main-content">
                {isVisible ? (
                    <div className="such-body" data-Hiden="Showen">
                        <h1 className="filter-title">Suchfilter</h1>
                        <text>Name:</text>
                        <form className="mainSearc__search" onSubmit={handleonSubmit}>
                            <input
                                type="text"
                                placeholder="Suche..."
                                value={receptName}
                                onChange={handleSearchChange}
                                className="mainSearc__search-input"
                            />
                        </form>
                        <table className="recipes-table">
                            <tbody>
                            <tr>
                                <th className="Tabel-Row">
                                    <text>Rating:</text>
                                </th>
                                <th>
                                    <text>Kategorie:</text>
                                </th>
                                <th>
                                    <text>Schwierigkeit:</text>
                                </th>

                            </tr>
                            <tr>
                                <th scope="col">
                                    <label className="pick-einzelnt">
                                        <select
                                            className="einzel-select"
                                            value={selectedRating}

                                            onChange={e => setSelectedRating(e.target.value)}
                                        >
                                            <option value="">Kein Rating ausgewählt</option>
                                            <option value="1 Stern">1 Stern</option>
                                            <option value="2 Sterne">2 Sterne</option>
                                            <option value="3 Sterne">3 Sterne</option>
                                            <option value="4 Sterne">4 Sterne</option>
                                            <option value="5 Sterne">5 Sterne</option>
                                        </select>
                                    </label>
                                </th>
                                <th scope="col">
                                    <label className="pick-einzelnt">
                                        <select
                                            className="einzel-select"
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
                                    </label>
                                </th>
                                <th scope="col">
                                    <label className="pick-einzelnt">
                                        <select
                                            className="einzel-select"
                                            value={selectedDifficulty}
                                            onChange={e => setSelectedDifficulty(e.target.value)}
                                        >
                                            <option value="">Keine Schwierigkeit ausgewählt</option>
                                            <option value="einfach">einfach</option>
                                            <option value="mittel">mittel</option>
                                            <option value="schwer">schwer</option>
                                        </select>
                                    </label>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                        <hr/>
                        <label>
                            <text>Zutaten auswählen:</text>
                            <div className="select-mehre-add-container">
                                <select
                                    className="einzel-select"
                                    value={selectedIngr}
                                    onChange={(e) => setSelectedIngr(e.target.value)}
                                >
                                    {ingredients.map((ingredient, index) => (
                                        <option key={index} value={ingredient}>
                                            {ingredient}
                                        </option>
                                    ))}
                                </select>
                                <button className="add-button" onClick={addVeg}>Hinzufügen</button>
                            </div>
                        </label>
                        <div className="auswahl-multi">
                            {selectedIngredients.map((veg) => (
                                <div className='ausgewhelt' key={veg}
                                     style={{marginTop: '10px', backgroundColor: "#cbd6dd"}}>
                                    {veg}
                                    <button className="remove-button" style={{color: "#07546E"}}
                                            onClick={() => removeVeg(veg)}>x
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="Submit-Search-Button" onClick={() => window.location.href = getLink()}>Suchen
                        </button>

                        <div style={{display: "none"}}>
                            <hr/>
                            <p>Such Name: {receptName}</p>
                            <p>Ausgewähltes Rating: {selectedRating}</p>
                            <p>Ausgewählte Kategorie: {selectedCategory}</p>
                            <p>Ausgewählte Schwierigkeit: {selectedDifficulty}</p>
                            <p>Ausgewählte Zutaten: {selectedIngredients.join(', ')}</p>
                            <p> Test: {selectedIngredients}</p>
                        </div>
                    </div>

                ) : ""}
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    <button className="Toggel-such-body-Button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? "Suchfilter verstecken" : "Suchfilter einblenden"}
                    </button>
                </div>

                <hr/>

                <div className="Zutaten-Visualation">
                    <SearchRecipeView name={receptName || ""} difficulty={selectedDifficulty || ""}
                                        category={selectedCategory || ""} ingredients={selectedIngredients.join(",")}>

                    </SearchRecipeView>
                </div>
            </main>

        </div>
    );
};

export default MainSearch;
