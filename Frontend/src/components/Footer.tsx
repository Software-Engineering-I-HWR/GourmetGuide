import React from 'react';
import './Footer.css';
import {Link} from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p className="footer__text">&copy; 2025 GourmetGuide: Gaumenschmaus. Alle Rechte vorbehalten. &nbsp;
                <Link to="/impressum" className="footer__link">Impressum</Link>
            </p>
        </footer>
    );
};

export default Footer;