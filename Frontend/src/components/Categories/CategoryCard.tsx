//import React, { useState } from "react";
import './CategoryCard.css';
import React from "react";
//import {useState} from "react";

interface CategoryCardProps {
    active: string;
    title: string;
    imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({active, title, imageUrl}) => {
   // const [isDisabled, setIsDisabled] = useState(true);


    return (
            <button className="category-card" value={active} onClick={() => active = 'true'}>
                <img src={imageUrl} alt={title} className="category-card__image"/>
                <div className="recipe-card__info">
                    <h3 className="recipe-card__title">{title}</h3>
                </div>
            </button>
    );
};


export default CategoryCard;