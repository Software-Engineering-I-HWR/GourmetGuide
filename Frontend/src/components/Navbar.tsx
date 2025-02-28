import React, {useEffect, useState} from 'react';
import './Navbar.css';
import PopupWindow from "../PopupWindow.tsx";
import configData from "../../../config/frontend-config.json";

interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
    isLoggedIn: boolean;
    setIsUserLoggedIn: (isLoggedIn: boolean) => void;
    username: string |null;
    showPoint: boolean;
    setShowPoint: (showPoint: boolean)=>void;
}

function getLink(temp: string) {
    if (temp == "") {
        return "/mainsearch";
    }
    return "/mainsearch/" + temp;

}

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
}

const hostData: Config = configData;

const Navbar: React.FC<NavbarProps> = ({title, isLoggedIn, setIsUserLoggedIn, username, showPoint, setShowPoint}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loginMessage, setLoginMessage] = useState('');
    const [showPopupMessage, setShowPopupMessage] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        window.location.href = getLink(searchTerm);
    };
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access token');
        setIsUserLoggedIn(false);
        setLoginMessage('Erfolgreich abgemeldet!');
        localStorage.setItem('loginMessage', JSON.stringify("Erfolgreich abgemeldet!"));
        setShowPopupMessage(true);
        window.location.href = '/';
    };

    useEffect(() => {
        setTimeout(() => {
            setShowPopupMessage(false);
        }, 5000);
    }, [showPopupMessage]);

    useEffect(() => {

    }, [handleLogout]);

    async function getNewRecipes(): Promise<void> {
        try {
            const response = await fetch(
                `https://` + hostData.host + `:30155/getNewRecipesByUser?user=${encodeURIComponent(username!)}`,
                {
                    method: "GET",
                }
            );
            if (response.ok) {
                const recipes = await response.json();
                if (recipes.length != 0) {
                    setShowPoint(true);
                } else {
                    setShowPoint(false);
                }
            } else {
                console.error("API request error:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    useEffect(() => {
        if (username != null) {
            getNewRecipes();
        }
    }, []);


    return (
        <nav className="navbar">
            {showPopupMessage && (
                <PopupWindow message={loginMessage}/>
            )}
            <div className="navbar__title">
                <img src="/images/Logo%20klein%20keinHintergrund.png" alt="Logo" className="navbar__logo"
                     onClick={() => window.location.href = '/'}/>
                <p className="navbar__projectname" onClick={() => window.location.href = '/'}>
                    {title}
                </p>
                <img src="/images/menuWhite.png" alt="Menü Button Mobile" className="menu-button-mobile"
                     onClick={() => setShowMobileMenu(!showMobileMenu)}/>
            </div>

            {showMobileMenu && <div className="navbar-actions-mobile">
                <a href='/personal-home' style={isLoggedIn ? {} : {display: 'none'}} className="navbar__link-mobile">Eigener
                    Bereich</a>
                <a href='/categories' className="navbar__link-mobile">Kategorien</a>
                <button
                    onClick={() => isLoggedIn ? handleLogout : window.location.href = window.location.origin + '/log-in'}
                    className="navbar__link-mobile">{isLoggedIn ? "Abmelden" : "Login"}</button>
            </div>}

            <div className="navbar__Buttons">
                <form className="navbar__search" onSubmit={handleOnSubmit}>
                    <input
                        type="text"
                        pattern="[A-Za-z0-9ÄÖÜäöüß ]*"
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Es dürfen keine Sonderzeichen enthalten sein!")}
                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                        placeholder="Suche..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="navbar__search-input"
                    />
                    <a
                        onClick={() => {
                            if (/^[A-Za-z0-9ÄÖÜäöüß ]*$/.test(searchTerm)) {
                                window.location.href = getLink(searchTerm);
                            } else {
                                alert("Ungültiges Suchmuster!" + "\n" +
                                    "Suche darf keine Sonderzeichen beinhalten!");
                            }
                        }}
                        className="navbar__link-words"
                        style={{marginBottom: '0.5%', marginTop: '0.5%', marginRight: "0.5%", padding: "0.5% 0.5%"}}
                        data-toggle="tooltip" data-placement="bottom" title="Suchen"
                    >
                        <img src="/images/Navbar/search.png" alt="Search"
                             className="navbar__icons_to_navigate"/>
                    </a>
                </form>
                <div className="navbar-actions">
                    <a href='/personal-home' style={isLoggedIn ? {} : {display: 'none'}}
                       className="navbar__link position-relative"
                       data-toggle="tooltip" data-placement="bottom" title="Eigener Bereich">
                        <img src="/images/Navbar/own-page.png" alt="Eigener Bereich"
                             className="navbar__icons_to_navigate"/>
                        {showPoint && (<span
                            className="position-absolute top-0 start-100 translate-middle p-2 bg-danger rounded-circle">
                                    <span className="visually-hidden">ungelesene Nachrichten</span>
                                </span>)}
                    </a>
                    <a href='/users' className="navbar__link" data-toggle="tooltip" data-placement="bottom"
                       title="User">
                        <img src="/images/Navbar/Users.png" alt="User"
                             className="navbar__icons_to_navigate"/>
                    </a>
                    <a href='/categories' className="navbar__link" data-toggle="tooltip" data-placement="bottom"
                       title="Kategorien">
                        <img src="/images/Navbar/category.png" alt="Kategorien"
                             className="navbar__icons_to_navigate"/>
                    </a>
                    <button onClick={() => {
                        if (isLoggedIn) {
                            handleLogout();
                        } else {
                            window.location.href = window.location.origin + '/log-in';
                        }
                    }}
                            className="navbar__link"
                            data-toggle="tooltip" data-placement="bottom" title={isLoggedIn ? "Log out" : "Log In"}
                    >
                        <img
                            src={isLoggedIn ? "/images/Navbar/log-out.png" : "/images/Navbar/log-in.png"}
                            alt="Log-In / Log-Out"
                            className="navbar__icons_to_navigate"/>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
