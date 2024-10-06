import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import MainSearch from './components/Search/MainSearch.tsx';
import Home from './components/Home/Home';
import Footer from "./components/Footer.tsx";
import ErrorPage from './components/errorPage.tsx';
import Categories from "./components/Categories/Categories.tsx";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Login/Register.tsx";
import ShowRecipe from "./components/ShowRecipe/ShowRecipe";
import "./PopupWindow.css";
import PopupWindow from "./PopupWindow.tsx";
import PersonalHome from "./components/PersonalHome/PersonalHome.tsx";
import CreateRecipe from "./components/CreateRecipe/CreateRecipe.tsx";


const App: React.FC = () => {
    const navLinks = [
        {name: 'Home', path: '/'},
        {name: 'Search', path: '/mainsearch'},
        {name: 'Kategorien', path: '/kategorien'},
        {name: 'Login', path: '/log-in'},
    ];
    const noNavbarFooterRoutes = ['/log-in', '/register'];
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    console.log(isLoggedIn, "was?");


    useEffect(() => {
        const isUserLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')!);
        if (isUserLoggedIn == null) {
            setIsLoggedIn(false);
        }
        if (isUserLoggedIn) {
            setIsLoggedIn(isUserLoggedIn);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem('loginMessage') != null) {
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                localStorage.removeItem('loginMessage');
            }, 5000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorage.getItem('loginMessage')]);

    const shouldShowNavbarFooter = !noNavbarFooterRoutes.includes(location.pathname);
    return (
        <Router>
            <>
                {shouldShowNavbarFooter && <Navbar isLoggedIn={isLoggedIn} title="GourmetGuide" links={navLinks}/>}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/mainsearch/:receptName?/:Category?/:Difficulty?/:zutaten?/:Fruit?"
                           element={<MainSearch/>}/>
                    <Route path="/categories" element={<Categories/>}/>/
                    <Route path="/log-in"
                           element={<Login isUserLoggedIn={isLoggedIn} setIsUserLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                    <Route path="/recipe/*" element={<ShowRecipe isLoggedIn={isLoggedIn} username={localStorage.getItem('userEmail')!} />}/>
                    <Route path="/personal-home" element={isLoggedIn ? (<PersonalHome/>) : (<ErrorPage/>)}/>
                    <Route path="/create-recipe" element={isLoggedIn ? (<CreateRecipe/>) : (<ErrorPage/>)}/>
                </Routes>
                {shouldShowNavbarFooter && <Footer/>}
                {showPopup && (
                    <PopupWindow message={localStorage.getItem('loginMessage')!}/>
                )}
            </>
        </Router>
    );
};

export default App;
