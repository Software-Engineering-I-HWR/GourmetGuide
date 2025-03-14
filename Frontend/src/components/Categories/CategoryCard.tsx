import './CategoryCard.css';
import React from "react";

interface CategoryCardProps {
    functionActive: (newText: string) => void;
    active: string;
    title: string;
    imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({functionActive, active, title, imageUrl}) => {
    return (
        <button className="category-card" value={active} onClick={() => {
            functionActive(title)
        }}>
            <img src={imageUrl} alt={title} className="category-card__image"/>
            <div className="category-card-info">
                <h3 className="category-card__title">{title}</h3>
            </div>
        </button>
    );
};

export default CategoryCard;