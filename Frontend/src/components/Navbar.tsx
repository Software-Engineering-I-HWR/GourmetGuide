import React, {StrictMode, useState} from 'react';
import './Navbar.css';
import {createRoot} from "react-dom/client";
import MainSearc from "./Search/MainSearc.tsx";


interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
    isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({title, isLoggedIn}) => {
    console.log("hallooooo", isLoggedIn);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        <a>href="/MainSearch" </a>
        event.preventDefault();
        console.log('Search term submitted:', searchTerm);
        // Füge hier die Suchlogik hinzu (z.B. eine API-Abfrage)
        createRoot(document.getElementById('searc')!).render(
            <StrictMode>
                <MainSearc/>
            </StrictMode>,
        );

        createRoot(document.getElementById('root')!).unmount();
    };


    return (
        <nav className="navbar">
            <div className="navbar__title">
                <img src="/images/Logo%20klein%20keinHintergrund.png" alt="Logo" className="navbar__logo"/>
                <a href="/" className="navbar__projectname">
                    {title}
                </a>
            </div>
            <form className="navbar__search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Suche..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="navbar__search-input"
                />
                <a type="Submit" href="/mainsearch" className="navbar__link">Suchen</a>
            </form>
            <div className="navbar-actions">
                <button onClick={() => window.location.href = '/home'} disabled={!isLoggedIn} className="navbar__link">Bereich</button>
                <button onClick={() => window.location.href = '/create'} disabled={!isLoggedIn} className="navbar__link">Erstellen</button>
                <button onClick={() => window.location.href = '/categories'} className="navbar__link">Kategorien</button>
                <button onClick={() => window.location.href = '/log-in'} disabled={isLoggedIn} className="navbar__link">Login</button>
            </div>
        </nav>
    );
};

export default Navbar;
