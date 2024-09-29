import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainSearc from './components/Search/MainSearc';
import Home from './components/Home/Home';
import Footer from "./components/Footer.tsx";
import ErrorPage from './components/errorPage.tsx';
import Categories from "./components/Categories/Categories.tsx";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Login/Register.tsx";
import ShowRecipe from "./components/ShowRecipe/ShowRecipe";

const App: React.FC = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Searc', path: '/mainsearc' },
        { name: 'Kategorien', path: '/kategorien' },
        { name: 'Login', path: '/log-in' },
    ];
    const noNavbarFooterRoutes = ['/log-in', '/register'];  // Hier alle Pfade hinzufügen, die ohne Navbar/Footer sein sollen

    const shouldShowNavbarFooter = !noNavbarFooterRoutes.includes(location.pathname);
    return (
        <Router>
            <>
                {shouldShowNavbarFooter && <Navbar title="GourmetGuide" links={navLinks} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mainsearc" element={<MainSearc />} />
                <Route path="/categories" element={<Categories />} />/
                <Route path="/log-in" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<ErrorPage />} />
                <Route path="/recipe/*" element={<ShowRecipe />} />
            </Routes>
            {shouldShowNavbarFooter && <Footer />}
        </>
        </Router>
    );
};

export default App;
