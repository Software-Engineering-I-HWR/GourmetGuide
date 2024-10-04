import "./PersonalHome.css"
import React, {useState} from "react";
import Hero from "../Home/Hero.tsx";

const PersonalHome: React.FC = () => {
    const [whichIsDisable, setWhichIsDisable] = useState(0);
    return (
        <div className="personalHome">
            <Hero title="Privater Bereich"
                  subtitle="Hier sehen Sie Ihre Rezepte und die Rezepte, die sie bewertet haben!"/>
            <div className="personalHome-main">
                <div className="personalHome-main-head">
                    <button className="personalHome-main-head__button"> Rezept erstellen</button>
                </div>
                <div className="personalHome-choose-buttons">
                    <button className="personalHome-ownRecipes"
                            onClick={() => whichIsDisable === 1 ? setWhichIsDisable(0) : setWhichIsDisable(1)}
                            value={whichIsDisable === 0 ? "enable" : "disable"}> Eigene Rezepte
                    </button>
                    <button className="personalHome-ratedRecipes"
                            onClick={() => whichIsDisable === 0 ? setWhichIsDisable(1) : setWhichIsDisable(0)}
                            value={whichIsDisable === 1 ? "enable" : "disable"}> Bewertete Rezepte
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PersonalHome;