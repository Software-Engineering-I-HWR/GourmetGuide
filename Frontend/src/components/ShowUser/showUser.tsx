import React, {useEffect, useRef, useState} from 'react';
import './showUser.css';
import configData from "../../../../config/frontend-config.json";
import * as bootstrap from 'bootstrap';

interface User {
    name: string;
    recentRecipes: Recipes[];
    likedRecipes: Recipes[];
}

interface UserModalProps {
    isLoggedIn: boolean;
    usernameLoggedIn: string;
    usernameToShow: string;
    closeModal: () => void;
}

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface Recipes {
    id: number;
    name: string;
    category: string;
    link: string;
}

const hostData: Config = configData;


const ShowUser: React.FC<UserModalProps> = ({isLoggedIn, usernameLoggedIn, usernameToShow, closeModal}) => {
        const carouselRef = useRef<HTMLDivElement>(null);
        const [isFollowed, setIsFollowed] = useState<boolean>(false);
        const [showMessage, setShowMessage] = useState<boolean>(false);
        const [showLoading1, setShowLoading1] = useState(0);
        const [showLoading2, setShowLoading2] = useState(0);
        const [noOwnRecipes, setNoOwnRecipes] = useState(false)
        const [noRatedRecipes, setNoRatedRecipes] = useState(false)


        const handlePrev = () => {
            if (carouselRef.current) {
                const carousel = new bootstrap.Carousel(carouselRef.current);
                carousel.prev();
            }
        };

        const handleNext = () => {
            if (carouselRef.current) {
                const carousel = new bootstrap.Carousel(carouselRef.current);
                carousel.next();
            }
        };

        const getIfFollow = async () => {
            try {
                const respone = await fetch(`https://` + hostData.host + `:30155/getFollowByUsers?user=${encodeURIComponent(usernameLoggedIn)}&follows=${encodeURIComponent(usernameToShow)}`, {
                    method: 'GET'

                });
                const isFollowedResponse = await respone.json();
                return isFollowedResponse[0].Follow === 1
            } catch (error) {
                console.error('Error getting follow status:', error);
                return false
            }
        }

        const [user, setUser] = useState<User>({
            name: usernameToShow,
            recentRecipes: [],
            likedRecipes: [],
        });

        const [ownIds, setOwnIds] = useState<number[]>([]);
        const [ratedIds, setRatedIds] = useState<number[]>([]);

        function onClose() {
            closeModal();
        }

        async function getRecipes(id: number): Promise<Recipes | null> {
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

        async function getOwnRecipes(): Promise<void> {
            try {
                /*if (usernameToShow == "GourmetGuide Team") {
                    const response = await fetch(
                        `https://` + hostData.host + `:30155/getRecipesByUser?user=${encodeURIComponent("1")}`,
                        {
                            method: "GET",
                        }
                    );
                    const response2 = await fetch(
                        `https://` + hostData.host + `:30155/getRecipesByUser?user=${encodeURIComponent("12345")}`,
                        {
                            method: "GET",
                        }
                    );
                    if (response.ok && response2.ok) {
                        const indexes = await response.json();
                        const indexes2 = await response2.json();
                        const ids = [
                            ...indexes.map((item: { ID: number }) => item.ID),
                            ...indexes2.map((item: { ID: number }) => item.ID),
                        ];
                        setOwnIds(ids);
                    } else {
                        console.error("API request error:", response.status);
                    }
                } else {*/
                    const response = await fetch(
                        `https://` + hostData.host + `:30155/getRecipesByUser?user=${encodeURIComponent(usernameToShow!)}`,
                        {
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const indexes = await response.json();
                        const ids = indexes.map((item: { ID: number }) => item.ID);
                        if (ids[0] == null) {
                            setNoOwnRecipes(true)
                            setShowLoading2(0)
                        }
                        setOwnIds(ids);
                    } else {
                        console.error("API request error:", response.status);
                    }
                //}
            } catch
                (error) {
                console.error("Network error:", error);
            }
        }

        async function getRatedRecipes(): Promise<void> {
            try {
                /*if (usernameToShow == "GourmetGuide Team") {
                    const response = await fetch(
                        `https://` + hostData.host + `:30155/getHighRatedRecipesByUser?user=${encodeURIComponent("1")}`,
                        {
                            method: "GET",
                        }
                    );
                    const response2 = await fetch(
                        `https://` + hostData.host + `:30155/getHighRatedRecipesByUser?user=${encodeURIComponent("12345")}`,
                        {
                            method: "GET",
                        }
                    );
                    if (response.ok && response2.ok) {
                        const indexes = await response.json();
                        const indexes2 = await response2.json();
                        const ids = [
                            ...indexes.map((item: { ID: number }) => item.ID),
                            ...indexes2.map((item: { ID: number }) => item.ID),
                        ];
                        setRatedIds(ids);
                    } else {
                        console.error("API request error:", response.status);
                    }
                } else {*/
                    const response = await fetch(
                        `https://` + hostData.host + `:30155/getRatedRecipesByUser?user=${encodeURIComponent(usernameToShow!)}`,
                        {
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const indexes = await response.json();
                        const ids = indexes.map((item: { ID: number }) => item.ID);
                        console.log("hier", ids)
                        if (ids[0] == null) {
                            console.log("here")
                            setNoRatedRecipes(true)
                            setShowLoading1(0)
                        }
                        setRatedIds(ids);
                    } else {
                        console.error("API request error:", response.status);
                    }
                //}
            } catch (error) {
                console.error("Network error:", error);
            }
        }

        useEffect(() => {
            const fetchRecipes = async () => {
                const loadedRecipes: Recipes[] = [];

                for (const id of ownIds) {
                    const recipe = await getRecipes(id);
                    if (recipe && Array.isArray(recipe)) {
                        const newRecipe: Recipes = {
                            id: recipe[0].ID,
                            name: recipe[0].Title,
                            category: recipe[0].Category,
                            link: recipe[0].Image,
                        };
                        loadedRecipes.push(newRecipe);
                    }
                }
                setUser((prevUser) => ({
                    ...prevUser,
                    recentRecipes: loadedRecipes,
                }));
                setShowLoading2(0)
            };

            if (ownIds.length > 0) {
                fetchRecipes();
            }
        }, [ownIds]);

        useEffect(() => {

            const checkFollow = async () => {
                try {
                    const isUserFollowed = await getIfFollow();
                    setIsFollowed(isUserFollowed);
                } catch (error) {
                    console.error("Error checking follow status:", error);
                }
            };

            checkFollow();
        }, []);

        const toggleFollow = async () => {
            if (!isLoggedIn) {
                return;
            }

            try {
                const newFollowState = !isFollowed;
                setIsFollowed(newFollowState);

                const response = await fetch(`https://` + hostData.host + `:30155/saveFollow?user=${encodeURIComponent(usernameLoggedIn)}&follows=${encodeURIComponent(usernameToShow)}&follow=${encodeURIComponent(newFollowState ? 1 : 0)}`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Failed to update follow');
                }
            } catch (error) {
                console.error('Error saving follow:', error);
                setIsFollowed(!isFollowed);
            }
        };

        useEffect(() => {
            const fetchRecipes2 = async () => {
                const loadedRecipes: Recipes[] = [];

                for (const id of ratedIds) {
                    const recipe = await getRecipes(id);
                    if (recipe && Array.isArray(recipe)) {
                        const newRecipe: Recipes = {
                            name: recipe[0].Title,
                            category: recipe[0].Category,
                            link: recipe[0].Image,
                            id: recipe[0].ID,
                        };
                        loadedRecipes.push(newRecipe);
                    }
                }
                setUser((prevUser) => ({
                    ...prevUser,
                    likedRecipes: loadedRecipes,
                }));
                setShowLoading1(0)
            };
            if (ratedIds.length > 0) {
                fetchRecipes2();
            }
        }, [ratedIds]);

        useEffect(() => {
            setShowLoading2(1)
            if (usernameToShow) {
                getOwnRecipes();
            }
        }, [usernameToShow]);

        useEffect(() => {
            setShowLoading1(1)
            if (usernameToShow) {
                getRatedRecipes();
            }
        }, [usernameToShow]);

        useEffect(() => {
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = "auto";
            };
        }, []);

        return (<div className="modal show d-block" tabIndex={-1}>
                <div className="modal-dialog modal-xl">
                    <div className="modal-content p-5">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h5 className="modal-title fs-2">{user.name}</h5>
                            <button
                                type="button"
                                className="btn"
                                style={isLoggedIn ? isFollowed ? {
                                    backgroundColor: "#98afbc",
                                    color: "#07546e",
                                    border: "3px solid #07546e",
                                    padding: "1% 2%",
                                    marginLeft: "5%"
                                } : {
                                    backgroundColor: "#07546E",
                                    color: "white",
                                    padding: "1% 2%",
                                    marginLeft: "5%"
                                } : {backgroundColor: "#cbd6dd", color: "#b1c3cd", padding: "1% 2%", marginLeft: "5%"}}
                                onClick={toggleFollow}
                                onMouseOver={() => !isLoggedIn && setShowMessage(true)}
                                onMouseLeave={() => setShowMessage(false)}
                            >
                                {isFollowed ? "Gefolgt" : "Folgen"}
                                {showMessage && <div className="message" style={{left: "75%"}}>
                                    Du musst dich anmelden, um das Rezept zu bewerten!
                                </div>}
                            </button>
                        </div>
                        <div className="modal-body">
                            <h6 className="mb-3 fs-4">Letzte Rezepte:</h6>
                            <div
                                id="recentRecipesCarousel"
                                className="carousel slide"
                                data-bs-ride="carousel"
                            >
                                <div className="carousel-inner">
                                    {showLoading2 == 1 && <div className="text-center">
                                        <div className="spinner-border" style={{color: "#07536D"}} role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                    </div>}
                                    {showLoading2 == 0 && noOwnRecipes && <div className="text-center">
                                        <p>Der User hat noch keine Rezepte erstellt!</p>
                                    </div>}
                                    {showLoading2 == 0 && user.recentRecipes
                                        .reduce((slides, recipe, index) => {
                                            const slideIndex = Math.floor(index / 4); // Zeige 4 Karten pro Slide
                                            if (!slides[slideIndex]) slides[slideIndex] = [];
                                            slides[slideIndex].push(recipe);
                                            return slides;
                                        }, [] as Recipes[][])
                                        .map((slide, index) => (
                                            <div
                                                className={`carousel-item ${
                                                    index === 0 ? "active" : ""
                                                }`}
                                                key={index}
                                            >
                                                <div className="row d-flex justify-content-between">
                                                    {slide.map((recipe) => (
                                                        <div
                                                            className="col-md-4 w-25"
                                                            key={recipe.id}
                                                        >
                                                            <div className="card recipe-card-showUser"
                                                                 onClick={() => window.location.href = `/recipe/${recipe.id}/`}>
                                                                <img
                                                                    src={recipe.link}
                                                                    className="card-img-top recipe-card-img-showUser"
                                                                    alt={recipe.name}
                                                                />
                                                                <div className="card-body">
                                                                    <h6 className="card-title small">
                                                                        {recipe.name.length > 40
                                                                            ? recipe.name.slice(0, 40) + "..."
                                                                            : recipe.name}
                                                                    </h6>
                                                                    <p className="card-text small text-muted">
                                                                        {recipe.category}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    onClick={handlePrev}
                                    data-bs-target="#recentRecipesCarousel"
                                    data-bs-slide="prev"
                                >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                                    <span className="visually-hidden">Vorheriges</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    onClick={handleNext}
                                    data-bs-target="#recentRecipesCarousel"
                                    data-bs-slide="next"
                                >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                                    <span className="visually-hidden">Nächstes</span>
                                </button>
                            </div>
                            <h6 className="mb-3 mt-5 fs-4">Rezepte, die {user.name} gefallen:</h6>
                            <div
                                id="likedRecipesCarousel"
                                className="carousel slide"
                                data-bs-ride="carousel"
                            >
                                <div className="carousel-inner">
                                    {showLoading1 == 1 && <div className="text-center">
                                        <div className="spinner-border" style={{color: "#07536D"}} role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                    </div>}
                                    {showLoading1 == 0 && noRatedRecipes && <div className="text-center">
                                        <p>Der User hat noch keine Rezepte gut bewertet!</p>
                                    </div>}
                                    {showLoading1 == 0 && user.likedRecipes
                                        .reduce((slides, recipe, index) => {
                                            const slideIndex = Math.floor(index / 4); // Zeige 4 Karten pro Slide
                                            if (!slides[slideIndex]) slides[slideIndex] = [];
                                            slides[slideIndex].push(recipe);
                                            return slides;
                                        }, [] as Recipes[][])
                                        .map((slide, index) => (
                                            <div
                                                className={`carousel-item ${
                                                    index === 0 ? "active" : ""
                                                }`}
                                                key={index}
                                            >
                                                <div className="row d-flex justify-content-between">
                                                    {slide.map((recipe) => (
                                                        <div
                                                            className="col-md-4 w-25"
                                                            key={recipe.id}
                                                        >
                                                            <div className="card recipe-card-showUser"
                                                                 onClick={() => window.location.href = `/recipe/${recipe.id}/`}>
                                                                <img
                                                                    src={recipe.link}
                                                                    className="card-img-top recipe-card-img-showUser"
                                                                    alt={recipe.name}
                                                                />
                                                                <div className="card-body">
                                                                    <h6 className="card-title small">
                                                                        {recipe.name.length > 40
                                                                            ? recipe.name.slice(0, 40) + "..."
                                                                            : recipe.name}
                                                                    </h6>
                                                                    <p className="card-text small text-muted">
                                                                        {recipe.category}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#likedRecipesCarousel"
                                    data-bs-slide="prev"
                                >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                                    <span className="visually-hidden">Vorheriges</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#likedRecipesCarousel"
                                    data-bs-slide="next"
                                >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                                    <span className="visually-hidden">Nächstes</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

export default ShowUser;
