import React from 'react';
import './RecipeCard.css';

interface RecipeCardProps {
    title: string;
    description: string;
    imageUrl: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, description, imageUrl }) => {
    return (
        <div className="recipe-card">
            <img src={imageUrl} alt={title} className="recipe-card__image" />
            <div className="recipe-card__info">
                <h3 className="recipe-card__title">{title}</h3>
                <p className="recipe-card__description">{description}</p>
            </div>
        </div>
    );
};

export default RecipeCard;
