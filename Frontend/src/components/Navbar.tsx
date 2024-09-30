import React, { useState} from 'react';
import './Navbar.css';


interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
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
    const handleonSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        window.location.href = getLink(searchTerm);
    };



    return (
        <nav className="navbar">
            <div className="navbar__title">
                <img src="/images/Logo%20klein%20keinHintergrund.png" alt="Logo" className="navbar__logo"/>
                <a href="/" className="navbar__projectname">
                    {title}
                </a>
            </div>
            <form className="navbar__search" onSubmit={handleonSubmit} >
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
                <a href="/bake" className="navbar__link">Backen</a>
                <a href="/cook" className="navbar__link">Kochen</a>
                <a href="/categories" className="navbar__link">Kategorien</a>
                <a href="/log-in" className="navbar__link">Login</a>
            </div>
        </nav>
    );
};

export default Navbar;
