import React, {useEffect, useState} from "react";
import './MainSearch.css';
import {useParams} from "react-router-dom";
import SearchRecipeView from "./SearchRecipeView.tsx";


const MainSearch: React.FC = () => {
    //receptName
    const receptStringName = useParams<{ receptName: string }>().receptName||"none";
    const [receptName, setReceptName] = useState<string>((receptStringName =="none"?"":receptStringName));
    //Category
    const selectedStringCategory = useParams<{ Category: string }>().Category||"none";
    const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory =="none"?"":selectedStringCategory));
    //Difficulty
    const selectedStringDifficulty = useParams<{ Difficulty: string }>().Difficulty||"none";
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>((selectedStringDifficulty =="none"?"":selectedStringDifficulty));
    //zutaten
    const [selectedIngr, setSelectedIngr] = useState('');
    const selectedStringIngredients = useParams<{ zutaten: string }>().zutaten||"none";
    const selectedStringArrayIngredients = selectedStringIngredients=="none"?[]:selectedStringIngredients.split(",");
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>(selectedStringArrayIngredients);
    //Rating
    const selectedStringRating = useParams<{ Rating: string }>().Rating||"none";
    const [selectedRating, setSelectedRating] = useState<string>((selectedStringRating =="none"?"":selectedStringRating));
    //Allergien
    const selectedStringAllergien = useParams<{ Allergien: string }>().Allergien||"none";
    const selectedStringArrayAllergien = selectedStringAllergien=="none"?[]:selectedStringAllergien.split(",");
    interface AllergienMitAuswahl{
        allergie: string;
        ausgewählt: boolean;
    }
    function getAllergien(): AllergienMitAuswahl[]{
        let temp = [{allergie:"Vegan", ausgewählt: false},{allergie:"Vegetarisch", ausgewählt: false},{allergie:"Glutenfrei", ausgewählt: false},{allergie:"Nussfrei", ausgewählt: false},{allergie:"Eifrei", ausgewählt: false},{allergie:"Lactosefrei", ausgewählt: false}];
        console.log(selectedStringArrayAllergien);
        temp.map((item: AllergienMitAuswahl) => {if(selectedStringArrayAllergien.some(e=> e== item.allergie) ){ item.ausgewählt = true}})
        console.log(temp);
        return temp
    }
    const [allergien, setAllergien] = useState<AllergienMitAuswahl[]>(getAllergien());


    const addVeg = () => {
        if (!selectedIngredients.includes(selectedIngr)) {
            setSelectedIngredients(prevVegs => [...prevVegs, selectedIngr]);
        }
    };

    const removeVeg = (veg: string) => {
        setSelectedIngredients(prevVegs => prevVegs.filter(v => v !== veg));
    };

    const toggelAllergien = (allergienZumToggeln: string) =>{
        setAllergien( preAllergien =>
            preAllergien.map(item =>
                item.allergie === allergienZumToggeln
                    ? { ...item, ausgewählt: !item.ausgewählt }
                    : item));
    }

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
        const tempURL = "/mainsearch/"+ (receptName==""?"none":receptName)+"/"+(selectedCategory==""?"none":selectedCategory)+"/"+(selectedDifficulty==""?"none":selectedDifficulty)+"/"+(selectedIngredients.toString()==""?"none":selectedIngredients.join(",").toString())+"/"+(selectedRating==""?"none":selectedRating)+"/"+(allergien.filter(item => item.ausgewählt).map(item=> item.allergie).join(",")==""?"none":(allergien.filter(item => item.ausgewählt).map(item=> item.allergie).join(",")))+"/";
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
                        <table className="Tabel">
                            <tbody>
                            <tr>
                                <th className="Tabel-Row">
                                    <text>Rating:</text>
                                </th>
                                <th>
                                    <text>Schwierigkeit:</text>
                                </th>
                                <th>
                                    <text>Kategorie:</text>
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
                                            <option value="1">★☆☆☆☆</option>
                                            <option value="2">★★☆☆☆</option>
                                            <option value="3">★★★☆☆</option>
                                            <option value="4">★★★★☆</option>
                                            <option value="5">★★★★★</option>
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
                                            <option value="1">sehr einfach</option>
                                            <option value="2">einfach</option>
                                            <option value="3">mittel</option>
                                            <option value="4">schwer</option>
                                            <option value="5">sehr schwer</option>
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

                            </tr>
                            </tbody>
                        </table>
                            <text style={{fontSize: "14px"}}>Allergien</text>
                                <div className="auswahl-multi-Allergien">
                                    {allergien.map((AllergienMitAuswahl) => (
                                        <div className='ausgewhelt-Allerfgien' key={AllergienMitAuswahl.allergie}
                                             style={{marginTop: '10px', backgroundColor: "#cbd6dd"}}>
                                            {AllergienMitAuswahl.allergie}
                                            <button className="add-allerfgie-button" style={{color: "#07546E"}}
                                                    onClick={() => toggelAllergien(AllergienMitAuswahl.allergie) }> {AllergienMitAuswahl.ausgewählt?"✓":" " }
                                            </button>
                                        </div>
                                    ))}
                                </div>

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
                        <hr/>
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
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button className="Toggel-such-body-Button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? "Suchfilter verstecken" : "Suchfilter einblenden"}
                    </button>
                </div>

                <hr/>

                <div className="Zutaten-Visualation">
                    <SearchRecipeView name={receptName || ""} difficulty={selectedDifficulty || ""}
                                      category={selectedCategory || ""} ingredients={selectedIngredients.join(",")} Rating ={selectedRating || ""} Allergien = {allergien.filter(item => item.ausgewählt).map(item=> item.allergie).join(",") || ""} >

                    </SearchRecipeView>
                </div>
            </main>

        </div>
    );
};

export default MainSearch;
