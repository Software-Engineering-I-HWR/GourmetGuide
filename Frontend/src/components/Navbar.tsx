import React, {useState} from 'react';
import './Navbar.css';

interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
}

const Navbar: React.FC<NavbarProps> = ({title}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Search term submitted:', searchTerm);
        // Füge hier die Suchlogik hinzu (z.B. eine API-Abfrage)
    };

    return (
        <nav className="navbar">
            <div className="navbar__title">
                <img src="/images/Logo%20klein.png" alt="Logo" className="navbar__logo"/>
                <div className="navbar__projectname">
                    {title}
                </div>
            </div>
            <form className="navbar__search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Suche..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="navbar__search-input"
                />
                <button type="submit" className="navbar__search-button">
                    Suchen
                </button>
            </form>
            <div className="navbar-actions">
                <a href="/log-in" className="navbar__link">Backen</a>
                <a href="/log-in" className="navbar__link">Kochen</a>
                <a href="/categories" className="navbar__link">Kategorien</a>
                <a href="/log-in" className="navbar__link">Login</a>
            </div>
        </nav>
    );
};

export default Navbar;
