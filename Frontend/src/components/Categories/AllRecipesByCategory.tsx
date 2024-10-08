import "./AllRecipesByCategory.css"
import React from "react";

interface AllRecipesByCategoryProps {
    title: string;
    category: string;
    imageUrl: string;
    id: number;
}

const AllRecipesByCategory: React.FC <AllRecipesByCategoryProps> = ({title, category, imageUrl, id}) => {
    return (
        <div className="AllRecipesByCategory">
            Hallo Welt
        </div>
    );
}

export default AllRecipesByCategory;