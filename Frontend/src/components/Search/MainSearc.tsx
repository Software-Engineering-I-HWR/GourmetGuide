import React, {useEffect, useState} from "react";
import './MainSearc.css';
import {useParams} from "react-router-dom";



const MainSearc: React.FC = () => {
    const { receptNameConst } = useParams();
    const [receptName, setReceptName]= useState<string>(''+receptNameConst);

    const [selectedFruit, setSelectedFruit] = useState('orange');
    const [selectedCategory, setSelectedCategory] = useState('Kuchen');
    const [selectedDifficulty, setSelectedDifficulty] = useState('einfach');
    const [selectedIngr, setSelectedIngr] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

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

            /* if (allIngredientsJson && Array.isArray(allIngredientsJson)) {
                 setIngredients(allIngredientsJson.sort());
             } else {
                 console.error('No valid recipes received or the data is not an array.');
             }*/
        };

        fetchRecipes();
    }, []);


    const handleonSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
    };

    const getNameSuche = ():string => {
        if(receptNameConst ==""||receptNameConst==undefined){
            return "Suchen..."
        }
        return receptNameConst
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceptName(event.target.value);
    };

    return (
        <div>
            <main className="main-content">
                <form className="mainSearc__search" onSubmit={handleonSubmit}>
                    <input
                        type="text"
                        placeholder= "Suche..."
                        value={receptName}
                        onChange={handleSearchChange}
                        className="mainSearc__search-input"
                    />
                </form>
                <table className="recipes-table">
                    <tbody>
                    <tr>
                        <th scope="col">
                            <label className="pick-einzelnt">
                                Frucht auswählen:
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
                                Kategorie:
                                <select
                                    className="einzel-select"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    <option value="Kuchen">Kuchen</option>
                                    <option value="Mittagessen">Mittagessen</option>
                                    <option value="Salat">Salat</option>
                                    <option value="Dessert">Dessert</option>
                                </select>
                            </label>
                        </th>
                        <th scope="col">
                            <label className="pick-einzelnt">
                                Schwierigkeit:
                                <select
                                    className="einzel-select"
                                    value={selectedDifficulty}
                                    onChange={e => setSelectedDifficulty(e.target.value)}
                                >
                                    <option value="einfach">einfach</option>
                                    <option value="mittel">mittel</option>
                                    <option value="schwer">schwer</option>
                                </select>
                            </label>
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                    </tbody>
                </table>
                <hr/>
                <label>
                    Zutaten auswählen :
                    <div className="select-mehre-add-container">
                        <select
                            className="einzel-select"
                            value={selectedIngr}
                            onChange={(e) => {
                                setSelectedIngr(e.target.value);
                            }}
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
                            <button onClick={() => removeVeg(veg)}>
                                x
                            </button>
                        </div>
                    ))}
                </div>

                <hr/>
                <p>Ausgewählte Frucht: {selectedFruit}</p>
                <p>Ausgewählte Kategorie: {selectedCategory}</p>
                <p>Ausgewählte Schwierigkeit: {selectedDifficulty}</p>
                <p>Ausgewählte Gemüse: {selectedIngredients.join(', ')}</p>
            </main>
        </div>
    );
};


export default MainSearc;
