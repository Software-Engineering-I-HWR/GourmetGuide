import React, {useEffect, useState} from 'react';
import './Navbar.css';


interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
    isLoggedIn: boolean;
}

function getLink(temp: string) {
    if (temp == "") {
        return "/mainsearc/";
    }
    return "/mainsearc/"+temp;

}

const Navbar: React.FC<NavbarProps> = ({title}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        window.location.href = getLink(searchTerm);
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isUserLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')!);
        if (isUserLoggedIn == null){
            setIsLoggedIn(false);
        }
        if (isUserLoggedIn) {
            setIsLoggedIn(isUserLoggedIn);
        }
    }, []);



    return (
        <nav className="navbar">
            <div className="navbar__title">
                <img src="/images/Logo%20klein%20keinHintergrund.png" alt="Logo" className="navbar__logo"/>
                <a href="/" className="navbar__projectname">
                    {title}
                </a>
            </div>
            <form className="navbar__search" onSubmit={handleOnSubmit} >
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
                <button onClick={() => window.location.href = '/home'} disabled={!isLoggedIn} className="navbar__link">Bereich</button>
                <button onClick={() => window.location.href = '/create'} disabled={!isLoggedIn} className="navbar__link">Erstellen</button>
                <button onClick={() => window.location.href = '/categories'} className="navbar__link">Kategorien</button>
                <button onClick={() => window.location.href = 'log-in'} className="navbar__link">{isLoggedIn ? "Abmelden" : "Login"}</button>
            </div>
        </nav>
    );
};

export default Navbar;
