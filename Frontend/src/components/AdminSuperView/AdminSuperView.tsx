import React, { useEffect, useState } from 'react';
import './AdminSuperView.css';
import { useNavigate } from 'react-router-dom';

const AdminSuperView = ({username}) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (username !== 'Admin') {
            alert('Nicht autorisiert!');
            navigate('/');
        } else {
            setIsAuthorized(true);
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const [recipesRes, usersRes] = await Promise.all([
                fetch('/api/recipes'),
                fetch('/api/users')
            ]);
            setRecipes(await recipesRes.json());
            setUsers(await usersRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDeleteRecipe = async (id: number) => {
        try {
            await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
            setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleChangePassword = async (id: number, newPassword: string) => {
        try {
            await fetch(`/api/users/${id}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            alert('Passwort geändert');
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    if (!isAuthorized) return null;

    return (
        <div className="admin-super-view">
            <h1>Admin Super View</h1>
            <section>
                <h2>Rezepte</h2>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            {recipe.name}
                            <button onClick={() => handleDeleteRecipe(recipe.id)}>Löschen</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Nutzer</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.username}
                            <button onClick={() => handleDeleteUser(user.id)}>Löschen</button>
                            <button
                                onClick={() =>
                                    handleChangePassword(user.id, prompt('Neues Passwort eingeben:') || '')
                                }
                            >
                                Passwort ändern
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminSuperView;
