import React, {useEffect, useState} from "react";
import './MainSearc.css';

const MainSearc: React.FC = () => {

    const [selectedFruit, setSelectedFruit] = useState('orange');
    const [selectedCategory, setSelectedCategory] = useState('Kuchen');
    const [selectedDifficulty, setSelectedDifficulty] = useState('einfach');
    const [selectedVeg, setSelectedVeg] = useState('cucumber');
    const [selectedVegs, setSelectedVegs] = useState<string[]>([]);

    const addVeg = () => {
        if (!selectedVegs.includes(selectedVeg)) {
            setSelectedVegs(prevVegs => [...prevVegs, selectedVeg]);
        }
    };

    const removeVeg = (veg: string) => {
        setSelectedVegs(prevVegs => prevVegs.filter(v => v !== veg));
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

    const [ingredients, setIngredients] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const allIngredientsJson = await getAllIngredients();

            if (allIngredientsJson && Array.isArray(allIngredientsJson)) {
                setIngredients(allIngredientsJson.sort());
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <main className="main-content">
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
                    Pick Gemüse :
                    <select
                        className="einzel-select"
                        value={selectedVeg}
                        onChange={e => setSelectedVeg(e.target.value)}
                    >
                        {ingredients.map((ingredient, index) => (
                            <option key={index} value={ingredient}>
                                {ingredient}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => {
                        addVeg;
                        console.log(ingredients)
                    }} style={{marginLeft: '10px'}}>Hinzufügen
                    </button>
                </label>
                <div className="auswahl-multi">
                    {selectedVegs.map((veg) => (
                        <div className='ausgewhelt' key={veg} style={{marginTop: '10px'}}>
                            {veg}
                            <button
                                onClick={() => removeVeg(veg)}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>

                <hr/>
                <p>Ausgewählte Frucht: {selectedFruit}</p>
                <p>Ausgewählte Kategorie: {selectedCategory}</p>
                <p>Ausgewählte Schwierigkeit: {selectedDifficulty}</p>
                <p>Ausgewählte Gemüse: {selectedVegs.join(', ')}</p>
            </main>
        </div>
    );
};


export default MainSearc;
