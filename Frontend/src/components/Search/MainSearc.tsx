import React, { useState } from "react";
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
                        <option value="cucumber">Cucumber</option>
                        <option value="corn">Corn</option>
                        <option value="tomato">Tomato</option>
                    </select>
                    <button onClick={addVeg} style={{marginLeft: '10px'}}>Hinzufügen</button>
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
