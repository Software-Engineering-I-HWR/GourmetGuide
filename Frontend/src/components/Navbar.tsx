import React from 'react';
import './Navbar.css';

interface NavbarProps {
    title: string;
    links: Array<{ name: string; path: string }>;
}

const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
    return (
        <nav className="navbar">
            <div className="navbar__title">{title}</div>
            <ul className="navbar__links">
                {links.map((link, index) => (
                    <li key={index} className="navbar__item">
                        <a href={link.path} className="navbar__link">
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;