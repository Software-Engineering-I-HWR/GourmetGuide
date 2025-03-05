import React, {useEffect, useState} from 'react';
import './AdminSuperView.css';
import {useNavigate} from 'react-router-dom';
import configData from '../../../../config/frontend-config.json';
import unlockedUsers from '../../../../config/unlocked-users.json';

interface AdminSuperViewProps {
    token: string;
}

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number;
    Allergen: string;
    Ingredients: string;
    Steps: string;
    Vegan: boolean;
    Vegetarian: boolean;
}

interface User {
    user: string;
    bewertungen: number;
    lesezeichen: number;
    rezepte: number;
    folgt: number;
    follower: number;
}

interface ListItem {
    id: number;
    title: string;
    category: string;
    ingredient: string;
    description: string;
    imageUrl: string;
    creator: string;
}

const hostData: Config = configData;

const AdminSuperView: React.FC<AdminSuperViewProps> = ({token}) => {
    const ignoredUsers: string[] = unlockedUsers.unlocked_users.map(user => user.username);

    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<ListItem[]>([]);
    const [recipeIds, setRecipeIds] = useState<number[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [passwordInputs, setPasswordInputs] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!token) {
                setIsAuthorized(false);
                alert('Nicht autorisiert!');
                navigate('/');
                return;
            }

            try {
                const response = await fetch(
                    `https://` + hostData.host + `:30155/checkAdmin?token=${encodeURIComponent(token)}`,
                    {
                        method: 'POST',
                    }
                );

                if (response.ok) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    alert('Nicht autorisiert!');
                    navigate('/');
                }
            } catch (error) {
                console.error('Fehler beim Überprüfen der Autorisierung:', error);
                setIsAuthorized(false);
                alert('Ein Fehler ist aufgetreten. Bitte später erneut versuchen.');
                navigate('/');
            }
        };

        checkAuthorization();
    }, [token, navigate]);

    useEffect(() => {
        getRecipeIDs();
    }, []);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            const loadedRecipes: ListItem[] = [];

            for (const id of recipeIds) {
                const recipe = await getRecipes(id);
                if (recipe && Array.isArray(recipe)) {
                    const newRecipe: ListItem = {
                        id: recipe[0].ID,
                        title: recipe[0].Title,
                        category: recipe[0].Category,
                        ingredient: recipe[0].Ingredients,
                        description: recipe[0].Steps,
                        imageUrl: recipe[0].Image,
                        creator: recipe[0].Creator,
                    };
                    loadedRecipes.push(newRecipe);
                }
            }
            setRecipes(loadedRecipes);
        };

        if (recipeIds.length > 0) {
            fetchRecipes();
        }
    }, [recipeIds]);

    useEffect(() => {
        const fetchUsers = async () => {
            const loadedUsers: User[] = [];

            for (const user of usernames) {
                const userInfo = await getUserInfo(user);
                if (userInfo) {
                    const newUser: User = {
                        user: userInfo.user,
                        bewertungen: userInfo.bewertungen,
                        lesezeichen: userInfo.lesezeichen,
                        rezepte: userInfo.rezepte,
                        folgt: userInfo.folgt,
                        follower: userInfo.follower,
                    };
                    loadedUsers.push(newUser);
                }
            }
            setUsers(loadedUsers);
        };

        if (recipeIds.length > 0) {
            fetchUsers();
        }
    }, [usernames]);

    async function getRecipeIDs(): Promise<void> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getRecipes`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const indexes = await response.json();
                const ids = indexes.map((item: { ID: number }) => item.ID);
                setRecipeIds(ids);
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async function getRecipes(id: number): Promise<Recipe | null> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getRecipeByID?id=${encodeURIComponent(id)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                return await response.json();
            } else {
                console.error("API request error:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
            return null;
        }
    }

    async function getUsers(): Promise<void> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getUsers`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const indexes = await response.json();
                const users = indexes.map((item: { Username: string }) => item.Username);
                setUsernames(users);
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async function getUserInfo(user: string): Promise<User | null> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getUserInfo?user=${encodeURIComponent(user)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                return await response.json();
            } else {
                console.error("API request error:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
            return null;
        }
    }

    async function handleDeleteRecipe(id: number) {
        const confirmed = window.confirm("Möchten Sie dieses Rezept wirklich löschen?");
        if (!confirmed) return;

        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/deleteRecipeByID?id=${encodeURIComponent(id)}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("Rezept wurde erfolgreich gelöscht.");
                setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
            } else if (response.status === 404) {
                alert("Rezept wurde nicht gefunden!");
            } else {
                alert(`Fehler beim Löschen des Rezepts: ${response.statusText}`);
            }
        } catch (error) {
            alert("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
            console.error("Network error:", error);
        }
    }

    async function handleDeleteUser(name: string) {
        const confirmed = window.confirm(`Möchten Sie den User '${name}' wirklich löschen?`);
        if (!confirmed) return;

        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/deleteUserByUsername?user=${encodeURIComponent(name)}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("User wurde erfolgreich gelöscht.");
                setUsers((prev) => prev.filter((item) => item.user !== name));
            } else {
                alert(`Fehler beim Löschen des Users: ${response.statusText}`);
            }
        } catch (error) {
            alert("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
            console.error("Network error:", error);
        }
    }

    async function handleChangePassword(name: string, password: string) {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/updatePasswordByUsername?user=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("Passwort wurde erfolgreich geändert.");
            } else {
                alert(`Fehler beim Löschen des Users: ${response.statusText}`);
            }
        } catch (error) {
            alert("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
            console.error("Network error:", error);
        }
    }

    const handlePasswordChange = (username: string, value: string) => {
        setPasswordInputs((prev) => ({
            ...prev,
            [username]: value,
        }));
    };

    if (!isAuthorized) return null;

    return (
        <div className="admin-super-view">
            <h1>Admin-Superview</h1>
            <section>
                <h2>Rezepte</h2>
                <div className="admin-home-recipes-table"
                     style={recipes.length == 1 ? {marginBottom: "30%"} : recipes.length == 2 ? {marginBottom: "20%"} : recipes.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
                    <table className="admin-recipes-table">
                        <thead>
                        <tr>
                            <th scope="col1">ID</th>
                            <th scope="col2">Titel</th>
                            <th scope="col3">Kategorie</th>
                            <th scope="col4">Zutaten</th>
                            <th scope="col5">Bild</th>
                            <th scope="col6">Ersteller</th>
                            <th scope="col7">Löschen</th>
                            {}
                        </tr>
                        </thead>
                        <tbody>
                        {recipes.map((recipe) => (
                            <tr key={recipe.id} onClick={() => (window.location.href = `/recipe/${recipe.id}/`)}>
                                <th scope="row">{recipe.id}</th>
                                <td>{recipe.title}</td>
                                <td>{recipe.category}</td>
                                <td>{recipe.ingredient}</td>
                                <td>
                                    <img
                                        src={recipe.imageUrl}
                                        style={{height: "7vw", objectFit: "cover", width: "100%"}}
                                        alt="Bild Rezept"
                                    />
                                </td>
                                <td>{recipe.creator}</td>
                                <td>
                                    {}
                                    <button className="admin-delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRecipe(recipe.id);
                                            }}
                                    >
                                        <img src="/images/delete.png" alt="Delete recipe"
                                             className="admin-delete-icon"/>
                                    </button>
                                </td>
                                {}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <section>
                <h2>Nutzer</h2>
                <div className="admin-home-user-table"
                     style={users.length == 1 ? {marginBottom: "30%"} : users.length == 2 ? {marginBottom: "20%"} : users.length == 3 ? {marginBottom: "10%"} : {marginBottom: "0"}}>
                    <table className="admin-user-table">
                        <thead>
                        <tr>
                            <th scope="col1">Name</th>
                            <th scope="col2">Rezepte</th>
                            <th scope="col3">Bewertungen</th>
                            <th scope="col4">Lesezeichen</th>
                            <th scope="col5">Follower</th>
                            <th scope="col6">Folgt</th>
                            <th scope="col7">Neues Passwort</th>
                            <th scope="col8">Passwort ändern</th>
                            <th scope="col9">Löschen</th>
                            {}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.user}>
                                <th scope="row">{user.user}</th>
                                <td>{user.rezepte}</td>
                                <td>{user.bewertungen}</td>
                                <td>{user.lesezeichen}</td>
                                <td>{user.follower}</td>
                                <td>{user.folgt}</td>
                                {!ignoredUsers.includes(user.user) && "GourmetGuide Team" != user.user && (
                                    <>
                                        <td>
                                            {}
                                            <input
                                                type="password"
                                                className="password-input"
                                                value={passwordInputs[user.user] || ''}
                                                onChange={(e) => handlePasswordChange(user.user, e.target.value)}
                                                placeholder="Neues Passwort"
                                            />
                                        </td>
                                        <td>
                                            {}
                                            <button className="admin-delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChangePassword(user.user, passwordInputs[user.user] || '');
                                                    }}
                                            >
                                                <img src="/images/reload.png" alt="Delete recipe"
                                                     className="admin-delete-icon"/>
                                            </button>
                                        </td>
                                        {}
                                        <td>
                                            {}
                                            <button className="admin-delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteUser(user.user);
                                                    }}
                                            >
                                                <img src="/images/delete.png" alt="Delete recipe"
                                                     className="admin-delete-icon"/>
                                            </button>
                                        </td>
                                        {}
                                    </>
                                )}
                                {ignoredUsers.includes(user.user) && (
                                    <>
                                        <td>
                                            Admin-User, keine Operationen möglich!
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminSuperView;
