import React, { useState } from "react";
import './MainSearc.css';

const MainSearc: React.FC = () => {

    const [selectedFruit, setSelectedFruit] = useState('orange');
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
                    <tr>
                        <th scope="col">
                            <label className="pick-einzelnt">
                                Pick einzelnt :
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
                                Pick einzelnt :
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
                                Pick einzelnt :
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
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                    <tr>
                        <td>Smarts, strong</td>
                    </tr>
                </table>
                <hr />
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
                    <button onClick={addVeg} style={{ marginLeft: '10px' }}>Hinzufügen</button>
                </label>
                <div className="auswahl-multi">
                    {selectedVegs.map((veg) => (
                        <div className='ausgewhelt' key={veg} style={{ marginTop: '10px' }}>
                            {veg}
                            <button
                                onClick={() => removeVeg(veg)}
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>

                <hr />
                <p>Einzel pick: {selectedFruit}</p>
                <p>Ausgewählte Gemüse: {selectedVegs.join(', ')}</p>
            </main>
        </div>
    );
};


export default MainSearc;
