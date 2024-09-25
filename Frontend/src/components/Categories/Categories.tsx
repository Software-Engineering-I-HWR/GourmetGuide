import './Categories.css';
import CategoryCard from "./CategoryCard.tsx";
import ErrorPage from "../errorPage.tsx";
import React, {useState} from "react";

const Categories: React.FC = () => {

    const [currentCategory, setCurrentCategory] = useState('Brot')
    const sampleCategories = [
        {
            functionActive: setCurrentCategory,
            active: currentCategory === 'Brot' ? 'true' : 'false',
            title: 'Brot',
            imageUrl: './../../../public/images/Brot.jpg'
        },
        {
            functionActive: setCurrentCategory,
            active: currentCategory === 'Dessert' ? 'true' : 'false',
            title: 'Dessert',
            imageUrl: './../../../public/images/Dessert.jpg'
        },
        {
            functionActive: setCurrentCategory,
            active: currentCategory === 'Kuchen' ? 'true' : 'false',
            title: 'Kuchen',
            imageUrl: './../../../public/images/Kuchen.jpg'
        },
        {
            functionActive: setCurrentCategory,
            active: currentCategory === 'Mittagessen' ? 'true' : 'false',
            title: 'Mittagessen',
            imageUrl: './../../../public/images/Mittagessen.jpg'
        },
        {
            functionActive: setCurrentCategory,
            active: currentCategory === 'Salat' ? 'true' : 'false',
            title: 'Salat',
            imageUrl: './../../../public/images/Salat.jpg'
        },
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
            <section className="recipes-by-category">
                <ErrorPage/>
            </section>
        </div>
    );
};


export default Categories;
