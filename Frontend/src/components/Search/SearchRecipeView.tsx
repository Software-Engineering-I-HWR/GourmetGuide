
import RecipeCard from '../Home/RecipeCard.tsx';
import '../../App.css';
import './SearchRecipeView.css'
import React, {useEffect, useState} from "react";

interface SuchFilter{
    name:string;
    difficulty:string;
    category:string;
    ingredients:string
    Rating: string;
    Allergien: string;
    Vegan: string;
    Vegetarian: string;

}

interface Recipe {
    Title: string;
    Category: string;
    Image: string;
    ID: number
}

interface ListItem {
    title: string;
    description: string;
    imageUrl: string;
    id: number
}

async function getRecipes({name, difficulty, category, ingredients, Rating, Allergien, Vegan, Vegetarian}: { name: string, difficulty: string, category: string, ingredients: string, Rating: string; Allergien: string; Vegan: string; Vegetarian: string; }): Promise<Recipe[] | null> {
    console.log(Allergien);
    const promt = `https://canoob.de:3007/getFilteredRecipes` +
        `?name=`+ (name==``? `&`: `${encodeURIComponent(name) }&`) +
        `difficulty=`+ (difficulty==``? `&`: `${encodeURIComponent(difficulty)}&`) +
        `category=`+ (category==``? `&`: `${encodeURIComponent(category)}&`) +
        `ingredients=` + (ingredients==``? `&`: `${encodeURIComponent(ingredients)}&`) +
        `vegetarian=`+ (Vegetarian==``? `&`: `${encodeURIComponent(Vegetarian)}&`) +
        `vegan=`+ (Vegan==``? `&`: `${encodeURIComponent(Vegan)}&`) +
        `allergen=` + (Allergien==``? `&`: `${encodeURIComponent(Allergien)}&`) +
        `rating=` + (Rating==``? `&`: `${encodeURIComponent(Rating)}&`)
    console.log(promt);
    try {
        const response = await fetch(promt);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('API request error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
}


const SearchRecipeView: React.FC<SuchFilter> = ({name, difficulty, category, ingredients, Rating, Allergien, Vegan, Vegetarian}) => {
    const [sampleRecipes, setSampleRecipes] = useState<ListItem[]>([]);
    console.log(Vegan);

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipes = await getRecipes({name, difficulty, category, ingredients, Rating, Allergien , Vegan, Vegetarian});
            if (recipes && Array.isArray(recipes)) {
                const lastFifteenRecipes = recipes.map(recipe => ({
                    title: recipe.Title,
                    description: recipe.Category,
                    imageUrl: recipe.Image,
                    id: recipe.ID
                }));
                setSampleRecipes(lastFifteenRecipes);
            } else {
                console.error('No valid recipes received or the data is not an array.');
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <main className="main-SearchRecipeView">
                <section className="recipes">
                    <h2 className="recipes__title"/>
                    <a className="recipes__list">
                        {sampleRecipes!.map((recipe, index) => (
                            <a
                                key={index}
                                className="recipes-link"
                                href={`/recipe/${recipe.id}/`}
                                style={{textDecoration: 'none'}}
                            >
                                <RecipeCard key={index} {...recipe} />
                            </a>
                        ))}
                    </a>
                </section>
            </main>
        </div>
    );
};

export default SearchRecipeView;
