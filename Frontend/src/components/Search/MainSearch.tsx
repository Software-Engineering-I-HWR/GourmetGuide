import React, {useEffect, useRef, useState} from "react";
import './MainSearch.css';
import {useParams} from "react-router-dom";
import SearchRecipeView from "./SearchRecipeView.tsx";
import configData from '../../../../config/frontend-config.json';

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

const hostData: Config = configData;

const MainSearch: React.FC = () => {
    //RecipeName
    const receptStringName = useParams<{ receptName: string }>().receptName || "none";
    const [receptName, setReceptName] = useState<string>((receptStringName == "none" ? "" : receptStringName));
    //Category
    const selectedStringCategory = useParams<{ Category: string }>().Category || "none";
    const [selectedCategory, setSelectedCategory] = useState<string>((selectedStringCategory == "none" ? "" : selectedStringCategory));
    //Difficulty
    const selectedStringDifficulty = useParams<{ Difficulty: string }>().Difficulty || "none";
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>((selectedStringDifficulty == "none" ? "" : selectedStringDifficulty));
    //Ingredients
    const [selectedIngr, setSelectedIngr] = useState('');
    const selectedStringIngredients = useParams<{ zutaten: string }>().zutaten || "none";
    const selectedStringArrayIngredients = selectedStringIngredients == "none" ? [] : selectedStringIngredients.split(",");
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>(selectedStringArrayIngredients);
    //Rating
    const selectedStringRating = useParams<{ Rating: string }>().Rating || "none";
    const [selectedRating, setSelectedRating] = useState<string>((selectedStringRating == "none" ? "" : selectedStringRating));
    const [showIngredientsTable, setShowIngredientsTable] = useState(false);
    //Allergies
    const selectedStringAllergien = useParams<{ Allergien: string }>().Allergien || "none";
    const selectedStringArrayAllergien = selectedStringAllergien == "none" ? [] : selectedStringAllergien.split(",");
    const [searchTerm, setSearchTerm] = useState('');

    const elementRef = useRef<HTMLUListElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
            setShowIngredientsTable(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    interface AllergienMitAuswahl {
        allergie: string;
        ausgewaehlt: boolean;
    }

    function getAllergien(): AllergienMitAuswahl[] {
        const temp = [{allergie: "Vegan", ausgewaehlt: false}, {
            allergie: "Vegetarisch",
            ausgewaehlt: false
        }, {allergie: "Glutenfrei", ausgewaehlt: false}, {
            allergie: "Nussfrei",
            ausgewaehlt: false
        }, {allergie: "Eifrei", ausgewaehlt: false}, {allergie: "Lactosefrei", ausgewaehlt: false}];
        temp.map((item: AllergienMitAuswahl) => {
            if (selectedStringArrayAllergien.some(e => e == item.allergie)) {
                item.ausgewaehlt = true
            }
        })
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

    const toggelAllergien = (allergienZumToggeln: string) => {
        setAllergien(preAllergien =>
            preAllergien.map(item =>
                item.allergie === allergienZumToggeln
                    ? {...item, ausgewaehlt: !item.ausgewaehlt}
                    : item));
    }

    function handleSelectIngr(ingredient: string) {
        setSearchTerm(ingredient);
        setSelectedIngr(ingredient);
    }

    interface Recipe {
        ingredient: string;
    }

    interface Category {
        Category: string;
    }

    async function getAllIngredients(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('https://' + hostData.host + ':30155/getAllIngredients');
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

    const handleonSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceptName(event.target.value);
    };

    function getLink() {
        const tempURL = "/mainsearch/" + (receptName == "" ? "none" : receptName) + "/" + (selectedCategory == "" ? "none" : selectedCategory) + "/" + (selectedDifficulty == "" ? "none" : selectedDifficulty) + "/" + (selectedIngredients.toString() == "" ? "none" : selectedIngredients.join(",").toString()) + "/" + (selectedRating == "" ? "none" : selectedRating) + "/" + (allergien.filter(item => item.ausgewaehlt).map(item => item.allergie).join(",") == "" ? "none" : (allergien.filter(item => item.ausgewaehlt).map(item => item.allergie).join(",")));
        return tempURL;
    }

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase()) // Filter nach Suchbegriff
    );
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div>
            <main className="main-content">
                {isVisible ? (
                    <div className="such-body" data-Hiden="Showen">
                        <h1 style={{fontSize: "3rem"}} className="filter-title">Suchfilter</h1>
                        <text style={{fontSize: "1.25rem"}}>Name:</text>
                        <form className="mainSearch__search" onSubmit={handleonSubmit}>
                            <input
                                type="text"
                                pattern="[A-Za-z0-9ÄÖÜäöüß ]{0,}"
                                placeholder="Suche..."
                                value={receptName}
                                onChange={handleSearchChange}
                                className="mainSearch__search-input"
                            />
                        </form>
                        <table className="table">
                            <tbody>
                            <tr>
                                <th className="table-Row">
                                    <text style={{fontSize: "1.25rem"}}>Rating:</text>
                                </th>
                                <th>
                                    <text style={{fontSize: "1.25rem"}}>Schwierigkeit:</text>
                                </th>
                                <th>
                                    <text style={{fontSize: "1.25rem"}}>Kategorie:</text>
                                </th>
                            </tr>
                            <tr>
                                <th scope="col">
                                    <label className="pick-einzeln">
                                        <select
                                            className="einzel-select"
                                            value={selectedRating}
                                            onChange={e => setSelectedRating(e.target.value)}
                                        >
                                            <option value="">Kein Rating ausgewaehlt</option>
                                            <option value="1">★☆☆☆☆</option>
                                            <option value="2">★★☆☆☆</option>
                                            <option value="3">★★★☆☆</option>
                                            <option value="4">★★★★☆</option>
                                            <option value="5">★★★★★</option>
                                        </select>
                                    </label>
                                </th>
                                <th scope="col">
                                    <label className="pick-einzeln">
                                        <select
                                            className="einzel-select"
                                            value={selectedDifficulty}
                                            onChange={e => setSelectedDifficulty(e.target.value)}
                                        >
                                            <option value="">Keine Schwierigkeit ausgewaehlt</option>
                                            <option value="1">sehr einfach</option>
                                            <option value="2">einfach</option>
                                            <option value="3">mittel</option>
                                            <option value="4">schwer</option>
                                            <option value="5">sehr schwer</option>
                                        </select>
                                    </label>
                                </th>
                                <th scope="col">
                                    <label className="pick-einzeln">
                                        <select
                                            className="einzel-select"
                                            value={selectedCategory}
                                            onChange={e => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="">Keine Kategorie ausgewaehlt</option>
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
                        <text style={{fontSize: "1.25rem"}}>Allergien</text>
                        <div className="auswahl-multi-Allergien">
                            {allergien.map((AllergienMitAuswahl) => (
                                <button
                                    className={`ausgewaehlte-Allergien ${AllergienMitAuswahl.ausgewaehlt ? 'selected' : ''}`}
                                    onClick={() => toggelAllergien(AllergienMitAuswahl.allergie)}
                                    key={AllergienMitAuswahl.allergie}>
                                    {AllergienMitAuswahl.allergie}
                                </button>
                            ))}
                        </div>
                        <hr/>
                        <label className="select-ingredients-label">
                            <text style={{fontSize: "1.25rem"}}>Zutaten auswählen:</text>
                            <div className="select-multiple-add-container" onFocus={() => setShowIngredientsTable(true)}>
                                <input
                                    className="select-mehre-add-container-text"
                                    type="text"
                                    placeholder="Zutat suchen..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setShowIngredientsTable(true)}
                                    style={{marginBottom: '2%', padding: '2% 2%', width: '100%'}}
                                />
                                {showIngredientsTable && filteredIngredients.length > 0 && (
                                    <ul ref={elementRef} style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        background: 'white',
                                        listStyle: 'none',
                                        padding: '5px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        margin: 0
                                    }}>
                                        {filteredIngredients.map((ingredient, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    handleSelectIngr(ingredient);
                                                }}
                                                style={{
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                            >
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button className="add-button-ingredients" onClick={() => {
                                    addVeg();
                                    setShowIngredientsTable(false);
                                }}>Hinzufügen
                                </button>
                            </div>
                        </label>
                        <div className="auswahl-multi">
                            {selectedIngredients.map((veg) => (
                                <div className='ausgewaehlt' key={veg}
                                     style={{marginTop: '10px', backgroundColor: "#cbd6dd"}}>
                                    {veg}
                                    <button className="remove-button" style={{color: "#07546E"}}
                                            onClick={() => removeVeg(veg)}>x
                                    </button>
                                </div>
                            ))}
                        </div>
                        <hr/>
                        <button className="submit-Search-Button" onClick={() => {
                            if (/^[A-Za-z0-9ÄÖÜäöüß ]*$/.test(receptName)) {
                                window.location.href = getLink()
                            } else {
                                alert("Ungültiges Suchmuster!" + "\n" +
                                    "Suche darf keine Sonderzeichen beinhalten!");
                            }
                        }}>Suchen
                        </button>
                        <div style={{display: "none"}}>
                            <hr/>
                            <p>Such Name: {receptName}</p>
                            <p>ausgewaehltes Rating: {selectedRating}</p>
                            <p>ausgewaehlte Kategorie: {selectedCategory}</p>
                            <p>ausgewaehlte Schwierigkeit: {selectedDifficulty}</p>
                            <p>ausgewaehlte Zutaten: {selectedIngredients.join(', ')}</p>
                            <p> Test: {selectedIngredients}</p>
                        </div>
                    </div>
                ) : ""
                }
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button className="toggle-such-body-Button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? "Suchfilter verstecken" : "Suchfilter einblenden"}
                    </button>
                </div>
                <hr/>
                <div className="Zutaten-Visualation">
                    <SearchRecipeView name={receptName || ""}
                                      difficulty={selectedDifficulty || ""}
                                      category={selectedCategory || ""}
                                      ingredients={selectedIngredients.join(",")}
                                      Rating={selectedRating || ""}
                                      Allergien={allergien.filter(item => item.ausgewaehlt && item.allergie != "Vegan" && item.allergie != "Vegetarisch").map(item => item.allergie).join(",") || ""}
                                      Vegetarian={allergien[1].ausgewaehlt ? "1" : ""}
                                      Vegan={allergien[0].ausgewaehlt ? "1" : ""}>
                    </SearchRecipeView>
                </div>
            </main>
        </div>
    );
};

export default MainSearch;
