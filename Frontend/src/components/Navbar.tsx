import React, {useEffect, useState} from 'react';
import './Navbar.css';

interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
    isLoggedIn: boolean;
}

function getLink(temp: string) {
    if (temp == "") {
        return "/mainsearch/";
    }
    return "/mainsearch/" + temp;

}

const Navbar: React.FC<NavbarProps> = ({title}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        window.location.href = getLink(searchTerm);
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const isUserLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')!);
        if (isUserLoggedIn == null) {
            setIsLoggedIn(false);
        }
        if (isUserLoggedIn) {
            setIsLoggedIn(isUserLoggedIn);
        }
    }, []);


    return (
        <nav className="navbar">
            <div className="navbar__title" onClick={() => window.location.href = '/'}>
                <img src="/images/Logo%20klein%20keinHintergrund.png" alt="Logo" className="navbar__logo"/>
                <p className="navbar__projectname">
                    {title}
                </p>
                <img src="/images/menu.png" alt="Menü Button Mobile" className="menu-button-mobile"
                     onClick={() => setShowMobileMenu(!showMobileMenu)}/>
            </div>

            {showMobileMenu && <div className="navbar-actions-mobile">
                <a href='/personal-home' style={isLoggedIn ? {} : {display: 'none'}} className="navbar__link-mobile">Eigener
                    Bereich</a>
                <a href='/categories' className="navbar__link-mobile">Kategorien</a>
                <a href='/log-in' className="navbar__link-mobile">{isLoggedIn ? "Abmelden" : "Login"}</a>
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
                    <a href='/log-in' className="navbar__link">{isLoggedIn ? "Abmelden" : "Login"}</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
