import Hero from './Hero.tsx';
import RecipeCard from './RecipeCard.tsx';
import "./Home.css"
import React, {useEffect, useState} from "react";
import configData from '../../../../config/frontend-config.json';
import ShowUser from "../ShowUser/showUser.tsx";

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
    ID: number
    Rating: number;
}

interface ListItem {
    title: string;
    description: string;
    imageUrl: string;
    id: number
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

interface HomeProps {
    isLoggedIn: boolean;
    username: string;
}


const hostData: Config = configData;

const Home: React.FC<HomeProps> = ({isLoggedIn, username}) => {
    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);
    const [sampleRecipes2, setSampleRecipes2] = useState<ListItem[]>([]);
    const [whichPage, setWhichPage] = useState<number>(0)
    const [animationClass, setAnimationClass] = useState<string>('');
    const [showLoading, setShowLoading] = useState(false);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [bestUsers, setBestUsers] = useState<User[]>([])
    const [showUser, setShowUser] = useState<boolean>(false);
    const [showUserByName, setShowUserByName] = useState<string>("");

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

    async function getHighRatedRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('https://' + hostData.host + ':30155/getBestRecipes');
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

    async function getRecipes(): Promise<Recipe[] | null> {
        try {
            const response = await fetch('https://' + hostData.host + ':30155/getRecipes');
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

    useEffect(() => {
        setShowLoading(true);
        getUsers();
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipes = await getRecipes();
            if (recipes && Array.isArray(recipes)) {
                const lastFifteenRecipes = recipes.slice(-15).reverse().map(recipe => ({
                    title: recipe.Title,
                    description: recipe.Category,
                    imageUrl: recipe.Image,
                    id: recipe.ID,
                }));
                setSampleRecipes(lastFifteenRecipes);
            }
            const recipes2 = await getHighRatedRecipes();
            if (recipes2 && Array.isArray(recipes2)) {
                const lastFifteenRecipes2 = recipes2.sort((a, b) => b.Rating - a.Rating).slice(0, 15).map(recipe => ({
                    title: recipe.Title,
                    description: recipe.Category,
                    imageUrl: recipe.Image,
                    id: recipe.ID,
                }));
                setSampleRecipes2(lastFifteenRecipes2);
            }
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
            setBestUsers(loadedUsers.sort((a, b) => b.follower - a.follower).slice(0, 10))
            console.log(loadedUsers.sort((a, b) => b.follower - a.follower).slice(0, 10));
            console.log(bestUsers);
        }
        setShowLoading(false)

        fetchRecipes()
    }, [bestUsers, usernames, whichPage]);

    function nextPage() {
        setAnimationClass('fade-out');
        if (whichPage < 2) {
            setTimeout(() => {
                setAnimationClass('fade-in');
                setWhichPage(whichPage + 1);
            }, 500)
        }
    }

    function prevPage() {
        setAnimationClass('fade-out');
        if (whichPage > 0) {
            setTimeout(() => {
                setAnimationClass('fade-in');
                setWhichPage(whichPage - 1);
            }, 500)
        }

    }

    return (
        <div>
            <Hero title="Willkommen bei GourmetGuide: Gaumenschmaus!" subtitle="Entdecke und teile coole Rezepte."/>
            <main className="main-content">
                <section className="recipes">
                    <div className="row justify-content-center d-flex flex-row align-items-center w-100 m-0">
                        <button
                            className="navigation-button w-auto"
                            onClick={prevPage}
                            disabled={whichPage === 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '2rem',
                                cursor: whichPage > 0 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-arrow-left-circle p-0" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                            </svg>
                        </button>
                        <h2 className="recipes__title m-5 w-50 text-center">{whichPage == 0 ? "Beliebteste Rezepte" : whichPage == 1 ? "Neuste Rezepte" : "Beliebteste User"}</h2>
                        <button
                            className="navigation-button w-auto h-auto"
                            onClick={nextPage}
                            disabled={whichPage === 2}
                            style={{
                                background: 'none',
                                border: "none",
                                fontSize: '2rem',
                                cursor: whichPage < 2 ? 'pointer' : 'not-allowed',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                            </svg>
                        </button>
                    </div>
                    {showLoading || sampleRecipes[1] == undefined || sampleRecipes2[1] == undefined &&
                        <div className="text-center" style={{minHeight: "100vh", marginTop: "-10%", paddingTop: "12%"}}>
                            <div className="spinner-border" style={{color: "#07536D"}} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>}
                    <div
                        className={`recipes__container ${animationClass}`}
                        style={{display: 'flex', alignItems: 'center'}}
                    >
                        {whichPage < 2 &&
                            <div className="recipes__list" style={{flex: 1, display: 'flex', overflowX: 'auto'}}>
                                {whichPage == 0 ? sampleRecipes2!.map((recipe, index) => (
                                    <a
                                        key={index}
                                        className="recipes-link"
                                        href={`/recipe/${recipe.id}/`}
                                        style={{textDecoration: 'none'}}
                                    >
                                        <RecipeCard key={index} {...recipe} />
                                    </a>
                                )) : sampleRecipes!.map((recipe, index) => (
                                    <a
                                        key={index}
                                        className="recipes-link"
                                        href={`/recipe/${recipe.id}/`}
                                        style={{textDecoration: 'none'}}
                                    >
                                        <RecipeCard key={index} {...recipe} />
                                    </a>
                                ))}
                            </div>}
                    </div>

                    <div
                        className={`recipes__container ${animationClass}`}
                        style={{display: 'flex', alignItems: 'center', marginBottom: "5%"}}
                    >
                        {whichPage == 2 && bestUsers[1] != undefined &&
                            <div className="container text-center d-flex justify-content-center">
                                <table className="d-flex w-100 justify-content-center podium mt-2">
                                    <tbody className="d-flex w-100 justify-content-center podium">
                                    <tr className="w-75 d-flex justify-content-center">
                                        <td className="best-user-column w-25 d-flex flex-column align-items-center justify-content-end">
                                            <p className="m-0" onClick={() => {
                                                setShowUserByName(bestUsers[1].user)
                                                setShowUser(!showUser)
                                            }}>{bestUsers[1].user}</p>
                                            <p className="m-1 fw-normal">{bestUsers[1].follower} Follower</p>
                                            <div className="col-4 w-100 d-flex justify-content-center text-center">
                                                <div className="podium-place second w-75"
                                                     style={{backgroundColor: "#98afbc"}}>
                                                    <span className="position">🥈 2</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="best-user-column w-25 d-flex flex-column align-items-center justify-content-end">
                                            <p className="m-0" onClick={() => {
                                                setShowUserByName(bestUsers[0].user)
                                                setShowUser(!showUser)
                                            }}>{bestUsers[0].user}</p>
                                            <p className="m-1 fw-normal">{bestUsers[0].follower} Follower</p>
                                            <div className="col-4 w-100 d-flex justify-content-center text-center">
                                                <div className="podium-place first w-75"
                                                     style={{backgroundColor: "#65899c"}}>
                                                    <span className="position">🥇 1</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="best-user-column w-25 d-flex flex-column align-items-center justify-content-end">
                                            <p className="m-0" onClick={() => {
                                                setShowUserByName(bestUsers[2].user)
                                                setShowUser(!showUser)
                                            }}>{bestUsers[2].user}</p>
                                            <p className="m-1 fw-normal">{bestUsers[2].follower} Follower</p>
                                            <div className="col-4 w-100 d-flex justify-content-center text-center">
                                                <div className="podium-place third w-75"
                                                     style={{backgroundColor: "#cbd6dd"}}>
                                                    <span className="position">🥉 3</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>}
                    </div>

                    <div
                        className={`recipes__container ${animationClass}`}
                    >
                        {whichPage == 2 && bestUsers[1] != undefined &&
                            <div className="w-100 d-flex flex-column align-items-center">
                                <p className="fs-4 mt-5 align-self-center">Weitere beliebte User:</p>
                                <table className="recipes-table mt-3 mb-5 w-50" style={{margin: "0"}}>
                                    <thead>
                                    <tr>
                                        <th className="fs-6" scope="col1">Username</th>
                                        <th className="fs-6" scope="col2">Anzahl Follower
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bestUsers.slice(3, 10).filter((a) => a.follower != 0).map((user) => (
                                        <tr onClick={() => {
                                            setShowUserByName(user.user)
                                            setShowUser(!showUser)
                                        }}>
                                            <td className="fs-6 d-flex justify-content-between align-items-center w-100">
                                                <span className="fs-6">{user.user}</span>
                                            </td>
                                            <td className="fs-6">{user.follower} Follower</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>}
                    </div>

                    {whichPage == 2 && bestUsers[1] == undefined &&
                        <div className="text-center" style={{minHeight: "100vh", marginTop: "-10%", paddingTop: "12%"}}>
                            <div className="spinner-border" style={{color: "#07536D"}} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>}
                </section>
                {showUser &&
                    <ShowUser isLoggedIn={isLoggedIn} usernameLoggedIn={username} usernameToShow={showUserByName}
                              closeModal={() => {
                                  setShowUser(false)
                                  setShowUserByName("")
                              }}/>}
            </main>
        </div>
    );
};

export default Home;
