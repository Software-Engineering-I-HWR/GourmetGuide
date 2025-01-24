import React, {useState} from 'react';
import './showUser.css';

interface Recipe {
    id: number;
    title: string;
}

interface User {
    name: string;
    recentRecipes: Recipe[];
    likedRecipes: Recipe[];
}

interface UserModalProps {
    username: string;
}

const ShowUser: React.FC<UserModalProps> = ({username}) => {
        const [user, setUser] = useState<User>({
            name: username,
            recentRecipes: [
                {id: 1, title: "Spaghetti Bolognese"},
                {id: 2, title: "Chicken Curry"},
                {id: 3, title: "Vegan Salad"},
            ],
            likedRecipes: [
                {id: 1, title: "Spaghetti Bolognese"},
                {id: 2, title: "Chicken Curry"},
                {id: 3, title: "Vegan Salad"},
            ],
        });

        function onClose() {
            console.log("function")
        }


        console.log(user)
        return (<div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{user!.name}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <h6>Letzte Rezepte:</h6>
                        <ul>
                            {user!.recentRecipes.map((recipe) => (
                                <li key={recipe.id}>{recipe.title}</li>
                            ))}
                        </ul>
                        <h6>Rezepte, die ihm gefallen:</h6>
                        <ul>
                            {user!.likedRecipes.map((recipe) => (
                                <li key={recipe.id}>{recipe.title}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Schließen
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }
;

export default ShowUser;
