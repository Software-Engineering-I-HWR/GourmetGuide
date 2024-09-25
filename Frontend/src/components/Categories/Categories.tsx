import './Categories.css';
import React from "react";
import CategoryCard from "./CategoryCard.tsx";

const Categories: React.FC = () => {



    //const [currentCategory, setCurrentCategory] = useState('Brot')
    const sampleCategories = [
        {active: 'true', title: 'Brot', imageUrl: './../../../public/images/Brot.jpg'},
        {active: 'false', title: 'Dessert', imageUrl: './../../../public/images/Dessert.jpg'},
        {active: 'false', title: 'Kuchen', imageUrl: './../../../public/images/Kuchen.jpg'},
        {active: 'false', title: 'Mittagessen', imageUrl: './../../../public/images/Mittagessen.jpg'},
        {active: 'false', title: 'Salat', imageUrl: './../../../public/images/Salat.jpg'},
    ];

    return (
        <div className="Mainpage">
            <section className="categories">
                <h2 className="categories__title">Kategorien</h2>
                <div className="categories__list">
                    {sampleCategories.sort().map((recipe, index) => (
                        <CategoryCard key={index} {...recipe}/>
                    ))}
                </div>
            </section>
        </div>
    );
};


export default Categories;
