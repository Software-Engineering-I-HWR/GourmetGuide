import "./Users.css";
import React, {useEffect, useState} from "react";
import Hero from "../Home/Hero.tsx";
import configData from '../../../../config/frontend-config.json';
import ShowUser from "../ShowUser/showUser.tsx";

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface User {
    id: number;
    user: string;
    bewertungen: number;
    lesezeichen: number;
    rezepte: number;
    folgt: number;
    follower: number;
}

interface UserProps {
    isLoggedIn: boolean;
    username: string;
}

const hostData: Config = configData;

const Users: React.FC<UserProps> = ({isLoggedIn, username}) => {
    const [usernames, setUsernames] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showUser, setShowUser] = useState<boolean>(false);
    const [showUserByName, setShowUserByName] = useState<string>("");
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [searchUser, setSearchUser] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

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
                console.log(usernames);
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

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchUser == "") {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter((user) => user.user.includes(searchUser)));
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const loadedUsers: User[] = [];
            let gourmetGuideTeamAlreadyDone: boolean = false;
            let index = 1;

            for (const user of usernames) {
                if ((user == "1" || user == "12345")) {
                    if (!gourmetGuideTeamAlreadyDone) {
                        const userInfo = await getUserInfo("1");
                        const userInfo2 = await getUserInfo("12345");
                        if (userInfo && userInfo2) {
                            const newUser: User = {
                                id: index,
                                user: "GourmetGuide Team",
                                bewertungen: userInfo.bewertungen + userInfo2.bewertungen,
                                lesezeichen: userInfo.lesezeichen,
                                rezepte: userInfo.rezepte + userInfo2.rezepte,
                                folgt: userInfo.folgt,
                                follower: userInfo.follower + userInfo2.follower,
                            };
                            loadedUsers.push(newUser);
                            gourmetGuideTeamAlreadyDone = true;
                        }
                    }else{
                        index--;
                    }
                } else {
                    const userInfo = await getUserInfo(user);
                    if (userInfo) {
                        const newUser: User = {
                            id: index,
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
                index++;
            }
            setUsers(loadedUsers);
            setFilteredUsers(loadedUsers);
            setShowLoading(false)
        };

        fetchUsers();

    }, [usernames]);

    useEffect(() => {
        setShowLoading(true);
        getUsers();
    }, []);

    useEffect(() => {
        console.log("geändert!")
    }, [users]);

    const filterByFollower = () =>{
        setFilteredUsers([...users].sort((a, b) => b.follower - a.follower))
    }
    const filterByRecipe = () =>{
        setFilteredUsers([...users].sort((a, b) => b.rezepte - a.rezepte))
    }
    const filterByName = () =>{
        setFilteredUsers([...users].sort((a, b) => a.user.localeCompare(b.user)))
    }
    const filterByIndex = () =>{
        setFilteredUsers([...users].sort((a, b) => a.id - b.id))
    }


    return (
        <div className="allUsersHome">
            <Hero
                title="Alle User"
                subtitle="Hier sehen Sie alle User und können nach ihnen suchen!"
            />
            {showLoading &&
                <div className="text-center" style={{minHeight: "100vh", marginTop: "-10%", paddingTop: "12%"}}>
                    <div className="spinner-border" style={{color: "#07536D"}} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>}

            {!showLoading && <div className="allUsersHome-main">
                <div className="head-line-show-users d-flex align-items-center justify-content-between">
                    <form onSubmit={submitSearch} className="input-group m-4 ms-5" style={{width: '49%'}}>
                        <input type="search" value={searchUser} onChange={(e) => setSearchUser(e.target.value)}
                               className="form-control" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-primary" style={{background: "#07546E"}} type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </button>
                    </form>

                    <div style={{display: "flex"}} className="dropdown m-4">
                        <button style={{background: "#07546E"}} className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-funnel w-75 h-75" viewBox="0 0 16 16">
                                <path
                                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                            </svg>
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item"
                                    onClick={filterByIndex}>ID
                            </button>
                            <button className="dropdown-item"
                                    onClick={filterByName}>Name
                            </button>
                            <button className="dropdown-item"
                                    onClick={filterByRecipe}>Rezept
                                Anzahl
                            </button>
                            <button className="dropdown-item"
                                    onClick={filterByFollower}>Follower
                                Anzahl
                            </button>
                        </div>

                    </div>
                </div>
                <table className="recipes-table mb-5" style={{margin: "0"}}>
                    <thead>
                    <tr>
                        <th scope="col1" onClick={() => setUsers([...users].sort((a, b) => a.id - b.id))}>#</th>
                        <th scope="col2"
                            onClick={() => setUsers([...users].sort((a, b) => a.user.localeCompare(b.user)))}>Name
                        </th>
                        <th scope="col3"
                            onClick={() => setUsers([...users].sort((a, b) => a.rezepte - b.rezepte))}> Anzahl
                            Rezepte
                        </th>
                        <th scope="col4"
                            onClick={() => setFilteredUsers([...users].sort((a, b) => a.follower - b.follower))}>Follower
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr>
                            <th scope="row">{user.id}</th>
                            <td className="d-flex justify-content-between align-items-center w-100">
                                <span>{user.user}</span>
                                <a onClick={() => {
                                    setShowUserByName(user.user)
                                    setShowUser(!showUser)
                                }} className="btn text-white" style={{background: "rgb(7,84,110)"}}
                                   role="button">View</a>
                            </td>
                            <td>{user.rezepte} Rezepte</td>
                            <td>{user.follower} Follower</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>}
            {showUser &&
                <ShowUser isLoggedIn={isLoggedIn} usernameLoggedIn={username} usernameToShow={showUserByName}
                          closeModal={() => {
                              setShowUser(false)
                              setShowUserByName("")
                          }}/>}
        </div>
    );
};

export default Users;
