import "./PersonalHome.css"
import React from "react";
import Hero from "../Home/Hero.tsx";

const PersonalHome: React.FC = () => {
    return (
        <div className="personalHome">
            <Hero title="Privater Bereich"
                  subtitle="Hier sehen Sie Ihre Rezepte und die Rezepte, die sie bewertet haben!"/>
            <div className="personalHome-main">
                <div className="personalHome-main-head">
                    <button className="personalHome-main-head__button"> Rezept erstellen </button>
                </div>
                <div className="personalHome-choose-buttons">
                    <button className="personalHome-ownRecipes"> Eigene Rezepte</button>
                    <button className="personalHome-ratedRecipes"> Bewertete Rezepte</button>
                </div>
            </div>
        </div>
    );
}

export default PersonalHome;