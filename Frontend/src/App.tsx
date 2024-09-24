import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainSearc from './Searc/MainSearc';
import Home from './Home/Home';
import Footer from "./components/Footer.tsx";
import ErrorPage from './components/errorPage.tsx';

const App: React.FC = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Searc', path: '/mainsearc' },
        { name: 'Kategorien', path: '/kategorien' },
        { name: 'Login', path: '/log-in' },
    ];
    return (
        <Router>
            <Navbar title="GourmetGuide" links={navLinks} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mainsearc" element={<MainSearc />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
