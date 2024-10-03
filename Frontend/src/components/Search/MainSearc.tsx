import React, {useEffect, useState} from "react";
import './MainSearc.css';
import {useParams} from "react-router-dom";
import SearchRecezeptView from "./SearchRecezeptView.tsx";


const MainSearc: React.FC = () => {
    const receptStringName = useParams<{ receptName: string }>().receptName||"none";
    const [receptName, setReceptName] = useState<string>((receptStringName =="none"?"":receptStringName));
    const selectedStringFruit = useParams<{ Fruit: string }>().Fruit||"none";
    const [selectedFruit, setSelectedFruit] = useState<string>((selectedStringFruit =="none"?"":selectedStringFruit));
    const selectedStringCategory = useParams<{ Category: string }>().Category||"none";
    const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory =="none"?"":selectedStringCategory));
    console.log(selectedCategory);
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
            const response = await fetch('http://canoob.de:3007/getAllIngredients');
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
            const response = await fetch('http://canoob.de:3007/getAllCategories');
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
        const tempURL = "/mainsearc/"+ (receptName==""?"none":receptName)+"/"+(selectedCategory==""?"none":selectedCategory)+"/"+(selectedDifficulty==""?"none":selectedDifficulty)+"/"+(selectedIngredients.toString()==""?"none":selectedIngredients.join(",").toString())+"/";
        console.log(tempURL)
        return tempURL;
    }
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div>
            <main className="main-content">
                {isVisible ? (
                    <div className="such-body" data-Hiden="Showen">
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
                                    <text>Frucht auswählen:</text>
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
                                            value={selectedFruit}

                                            onChange={e => setSelectedFruit(e.target.value)}
                                        >
                                            <option value="apple">Apple</option>
                                            <option value="banana">Banana</option>
                                            <option value="orange">Orange</option>
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
                                            <option value="">Keine Categorie Ausgewählt</option>
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
                                            <option value="">Keine Difficult Ausgewählt</option>
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
                                <button onClick={addVeg}>Hinzufügen</button>
                            </div>
                        </label>
                        <div className="auswahl-multi">
                            {selectedIngredients.map((veg) => (
                                <div className='ausgewhelt' key={veg} style={{marginTop: '10px'}}>
                                    {veg}
                                    <button onClick={() => removeVeg(veg)}>x</button>
                                </div>
                            ))}
                        </div>
                        <button className="Submit-Search-Button" onClick={() => window.location.href = getLink()}>Submit
                            Search
                        </button>

                        <div style={{display: "none"}}>
                            <hr/>
                            <p>Such Name: {receptName}</p>
                            <p>Ausgewählte Frucht: {selectedFruit}</p>
                            <p>Ausgewählte Kategorie: {selectedCategory}</p>
                            <p>Ausgewählte Schwierigkeit: {selectedDifficulty}</p>
                            <p>Ausgewählte Zutaten: {selectedIngredients.join(', ')}</p>
                            <p> Teset: {selectedIngredients}</p>
                        </div>
                    </div>

                ) : ""}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="Toggel-such-body-Button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? "Hide Such Menü" : "Show Such Menü"}
                    </button>
                </div>

                <hr/>

                <div className="Zutaten-Visualation">
                    <SearchRecezeptView name={receptName || ""} difficulty={selectedDifficulty || ""}
                                        category={selectedCategory || ""} ingredients={selectedIngredients.join(",")}>

                    </SearchRecezeptView>
                </div>
            </main>

        </div>
    );
};

export default MainSearc;
