import React, {useEffect, useState} from 'react';
import './Navbar.css';
import PopupWindow from "../PopupWindow.tsx";

interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
    isLoggedIn: boolean;
    setIsUserLoggedIn: (isLoggedIn: boolean) => void;
}

function getLink(temp: string) {
    if (temp == "") {
        return "/mainsearch";
    }
    return "/mainsearch/" + temp;

}

const Navbar: React.FC<NavbarProps> = ({title, isLoggedIn, setIsUserLoggedIn}) => {
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
        // Lösche die Daten im Local Storage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access token'); // Lösche gespeicherte E-Mail
        setIsUserLoggedIn(false);
        setLoginMessage('Erfolgreich abgemeldet!'); // Logout-Nachricht anzeigen
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
                <button onClick={() => isLoggedIn ? handleLogout : window.location.href = window.location.origin + '/log-in'}
                        className="navbar__link-mobile">{isLoggedIn ? "Abmelden" : "Login"}</button>
            </div>}

            <div className="navbar__Buttons">
                <form className="navbar__search" onSubmit={handleOnSubmit}>
                    <input
                        type="text"
                        placeholder="Suche..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="navbar__search-input"
                    />
                    <a type="Submit" href={getLink(searchTerm)} className="navbar__link">Suchen</a>
                </form>
                <div className="navbar-actions">
                    <a href='/personal-home' style={isLoggedIn ? {} : {display: 'none'}} className="navbar__link">Eigener
                        Bereich</a>
                    <a href='/categories' className="navbar__link">Kategorien</a>
                    <button onClick={() => {
                        if (isLoggedIn) {
                            handleLogout();
                        } else {
                            window.location.href = window.location.origin + '/log-in';
                        }
                    }}
                            className="navbar__link">{isLoggedIn ? "Abmelden" : "Login"}</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
