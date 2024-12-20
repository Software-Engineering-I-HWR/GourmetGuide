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
import {jwtDecode} from "jwt-decode";


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


    useEffect(() => {
        const isTokenValid = (token: string) => {
            if (!token) return false;

            try {
                const decodedToken: any = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Aktuelle Zeit in Sekunden

                // Überprüfe das 'exp' Feld des Tokens
                return decodedToken.exp > currentTime; // Gültig, wenn 'exp' größer ist als die aktuelle Zeit
            } catch (error) {
                console.error("Token kann nicht dekodiert werden:", error);
                return false;
            }
        };
        const token = localStorage.getItem('access token');
        if (!token){
            setIsLoggedIn(false);
        }
        if (isTokenValid(token!)){
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem('loginMessage') != null) {
            localStorage.removeItem('loginMessage');
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                localStorage.removeItem('loginMessage');
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorage.getItem('loginMessage')]);

    const shouldShowNavbarFooter = !noNavbarFooterRoutes.includes(location.pathname);
    return (
        <Router>
            <>
                {shouldShowNavbarFooter && <Navbar isLoggedIn={isLoggedIn} setIsUserLoggedIn={setIsLoggedIn} title="GourmetGuide" links={navLinks}/>}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/mainsearch/:receptName?/:Category?/:Difficulty?/:zutaten?/:Rating?/:Allergien?"
                           element={<MainSearch/>}/>
                    <Route path="/categories" element={<Categories/>}/>/
                    <Route path="/log-in"
                           element={<Login isUserLoggedIn={isLoggedIn} setIsUserLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                    <Route path="/recipe/*" element={<ShowRecipe isLoggedIn={isLoggedIn}
                                                                 username={localStorage.getItem('userEmail')!}/>}/>
                    <Route path="/personal-home" element={isLoggedIn ? (<PersonalHome/>) : (<ErrorPage/>)}/>
                    <Route path="/create-recipe" element={isLoggedIn ? (<CreateRecipe/>) : (<ErrorPage/>)}/>
                </Routes>
                {shouldShowNavbarFooter && <Footer/>}
                {showPopup && localStorage.getItem('loginMessage')!=undefined && (
                    <PopupWindow message={localStorage.getItem('loginMessage')!}/>
                )}
            </>
        </Router>
    );
};

export default App;
